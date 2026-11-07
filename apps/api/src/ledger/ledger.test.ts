import { describe, expect, it } from 'vitest';
import { Ledger, LedgerError } from './ledger';

function setup() {
  const ledger = new Ledger();
  const funding = ledger.openAccount({ kind: 'funding_clearing', currency: 'CAD', allowNegative: true });
  const alice = ledger.openAccount({ kind: 'customer_wallet', currency: 'CAD', ownerId: 'alice', allowNegative: false });
  const bob = ledger.openAccount({ kind: 'customer_wallet', currency: 'CAD', ownerId: 'bob', allowNegative: false });
  ledger.post('topup-1', 'Interac top-up', [
    { accountId: funding.id, amountMinor: -10_000 },
    { accountId: alice.id, amountMinor: 10_000 },
  ]);
  return { ledger, funding, alice, bob };
}

describe('Ledger', () => {
  it('moves money between wallets and keeps the books balanced', () => {
    const { ledger, alice, bob } = setup();
    ledger.post('t-1', 'Alice to Bob', [
      { accountId: alice.id, amountMinor: -2_500 },
      { accountId: bob.id, amountMinor: 2_500 },
    ]);
    expect(ledger.balance(alice.id)).toBe(7_500);
    expect(ledger.balance(bob.id)).toBe(2_500);
    expect(ledger.trialBalance()).toEqual({ CAD: 0 });
  });

  it('never lets a wallet go below zero, and changes nothing when refused', () => {
    const { ledger, alice, bob } = setup();
    expect(() =>
      ledger.post('t-2', 'Too much', [
        { accountId: alice.id, amountMinor: -10_001 },
        { accountId: bob.id, amountMinor: 10_001 },
      ]),
    ).toThrow(LedgerError);
    expect(ledger.balance(alice.id)).toBe(10_000);
    expect(ledger.balance(bob.id)).toBe(0);
  });

  it('rejects entries that do not balance', () => {
    const { ledger, alice, bob } = setup();
    expect(() =>
      ledger.post('t-3', 'Broken', [
        { accountId: alice.id, amountMinor: -100 },
        { accountId: bob.id, amountMinor: 99 },
      ]),
    ).toThrow(/sum to zero/);
  });

  it('applies a retried request only once', () => {
    const { ledger, alice, bob } = setup();
    const lines = [
      { accountId: alice.id, amountMinor: -1_000 },
      { accountId: bob.id, amountMinor: 1_000 },
    ];
    const first = ledger.post('same-key', 'Retry', lines);
    const second = ledger.post('same-key', 'Retry', lines);
    expect(second.id).toBe(first.id);
    expect(ledger.balance(bob.id)).toBe(1_000);
  });
});
