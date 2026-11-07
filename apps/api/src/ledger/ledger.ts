import { randomUUID } from 'node:crypto';
import type { Currency } from '@oenodpay/shared';

/**
 * Double-entry ledger: the single source of truth for every dollar.
 *
 * Rules:
 *  - Balances are never edited. Money only moves by posting a journal entry.
 *  - Every entry has at least two lines and its lines sum to zero per currency.
 *  - Every entry carries an idempotency key, so a retried request never moves money twice.
 *  - Customer wallet accounts can never go below zero.
 *
 * This in-memory implementation defines the behaviour; the PostgreSQL schema in
 * db/migrations enforces the same rules with constraints and serializable transactions.
 */
export type AccountKind = 'customer_wallet' | 'funding_clearing' | 'payout_clearing' | 'fee_revenue';

export interface Account {
  id: string;
  kind: AccountKind;
  currency: Currency;
  ownerId?: string;
  /** Customer wallets must not go negative; internal clearing accounts may. */
  allowNegative: boolean;
}

export interface EntryLine {
  accountId: string;
  /** Positive = credit (money in), negative = debit (money out), in minor units */
  amountMinor: number;
}

export interface JournalEntry {
  id: string;
  idempotencyKey: string;
  description: string;
  lines: EntryLine[];
  createdAt: string;
}

export class LedgerError extends Error {
  constructor(public code: 'unbalanced' | 'insufficient_funds' | 'unknown_account' | 'invalid_amount' | 'currency_mismatch', message: string) {
    super(message);
  }
}

export class Ledger {
  private accounts = new Map<string, Account>();
  private balances = new Map<string, number>();
  private entries: JournalEntry[] = [];
  private byIdempotencyKey = new Map<string, JournalEntry>();

  openAccount(input: Omit<Account, 'id'>): Account {
    const account: Account = { id: randomUUID(), ...input };
    this.accounts.set(account.id, account);
    this.balances.set(account.id, 0);
    return account;
  }

  getAccount(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  balance(accountId: string): number {
    const b = this.balances.get(accountId);
    if (b === undefined) throw new LedgerError('unknown_account', 'Account not found');
    return b;
  }

  history(accountId: string): Array<{ entry: JournalEntry; amountMinor: number }> {
    return this.entries
      .flatMap((entry) => entry.lines.filter((l) => l.accountId === accountId).map((l) => ({ entry, amountMinor: l.amountMinor })))
      .reverse();
  }

  /** Posts an entry atomically: either every line applies, or none do. */
  post(idempotencyKey: string, description: string, lines: EntryLine[]): JournalEntry {
    const existing = this.byIdempotencyKey.get(idempotencyKey);
    if (existing) return existing;

    if (lines.length < 2) throw new LedgerError('unbalanced', 'An entry needs at least two lines');
    const currencies = new Set<Currency>();
    let sum = 0;
    for (const line of lines) {
      if (!Number.isSafeInteger(line.amountMinor) || line.amountMinor === 0) {
        throw new LedgerError('invalid_amount', 'Amounts must be non-zero whole minor units');
      }
      const account = this.accounts.get(line.accountId);
      if (!account) throw new LedgerError('unknown_account', 'Account not found');
      currencies.add(account.currency);
      sum += line.amountMinor;
    }
    if (currencies.size !== 1) throw new LedgerError('currency_mismatch', 'Convert currency through FX accounts, not in one entry');
    if (sum !== 0) throw new LedgerError('unbalanced', 'Entry lines must sum to zero');

    // Check every resulting balance before applying anything.
    const next = new Map<string, number>();
    for (const line of lines) {
      const current = next.get(line.accountId) ?? this.balance(line.accountId);
      next.set(line.accountId, current + line.amountMinor);
    }
    for (const [accountId, value] of next) {
      const account = this.accounts.get(accountId)!;
      if (!account.allowNegative && value < 0) {
        throw new LedgerError('insufficient_funds', 'Not enough money in the wallet');
      }
    }

    const entry: JournalEntry = { id: randomUUID(), idempotencyKey, description, lines, createdAt: new Date().toISOString() };
    for (const [accountId, value] of next) this.balances.set(accountId, value);
    this.entries.push(entry);
    this.byIdempotencyKey.set(idempotencyKey, entry);
    return entry;
  }

  /** Sum of every balance per currency. Must always be zero; checked by reconciliation. */
  trialBalance(): Record<string, number> {
    const totals: Record<string, number> = {};
    for (const [id, value] of this.balances) {
      const currency = this.accounts.get(id)!.currency;
      totals[currency] = (totals[currency] ?? 0) + value;
    }
    return totals;
  }
}
