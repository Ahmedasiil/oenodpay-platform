import { describe, expect, it } from 'vitest';
import { freshRepo, rawPool, repoKinds } from '../test/repos';
import type { Repository } from './types';

async function fundedPair(repo: Repository, amount = 10_000) {
  const a = await repo.createUser({ email: 'alice@example.com', fullName: 'Alice', passwordHash: null });
  const b = await repo.createUser({ email: 'bob@example.com', fullName: 'Bob', passwordHash: null });
  await repo.post('seed', 'Top-up', [
    { accountId: repo.system.funding, amountMinor: -amount },
    { accountId: a.walletAccountId, amountMinor: amount },
  ]);
  return { a, b };
}

describe.each(repoKinds)('Repository contract (%s)', (kind) => {
  it('creates people with unique handles and a CAD wallet', async () => {
    const repo = await freshRepo(kind);
    const one = await repo.createUser({ email: 'Sam@Example.com', fullName: 'Sam', passwordHash: null });
    const two = await repo.createUser({ email: 'sam@other.com', fullName: 'Sam Two', passwordHash: null });
    expect(one.email).toBe('sam@example.com');
    expect(one.handle).toBe('sam');
    expect(two.handle).toBe('sam2');
    expect(await repo.balance(one.walletAccountId)).toBe(0);
    expect((await repo.findByHandle('@SAM'))?.id).toBe(one.id);
    await expect(repo.createUser({ email: 'sam@example.com', fullName: 'Dup', passwordHash: null })).rejects.toThrow('email_taken');
  });

  it('moves money, keeps the books at zero and refuses overdrafts', async () => {
    const repo = await freshRepo(kind);
    const { a, b } = await fundedPair(repo);
    await repo.post('t1', 'Alice to Bob', [
      { accountId: a.walletAccountId, amountMinor: -2_500 },
      { accountId: b.walletAccountId, amountMinor: 2_500 },
    ]);
    expect(await repo.balance(a.walletAccountId)).toBe(7_500);
    expect(await repo.balance(b.walletAccountId)).toBe(2_500);
    expect(await repo.trialBalance()).toEqual({ CAD: 0 });
    await expect(repo.post('t2', 'Too much', [
      { accountId: b.walletAccountId, amountMinor: -9_999 },
      { accountId: a.walletAccountId, amountMinor: 9_999 },
    ])).rejects.toMatchObject({ code: 'insufficient_funds' });
    expect((await repo.history(b.walletAccountId, 10))[0]).toMatchObject({ description: 'Alice to Bob', amountMinor: 2_500 });
  });

  it('applies an idempotency key once and refuses it for a different request', async () => {
    const repo = await freshRepo(kind);
    const { a, b } = await fundedPair(repo);
    const lines = [
      { accountId: a.walletAccountId, amountMinor: -1_000 },
      { accountId: b.walletAccountId, amountMinor: 1_000 },
    ];
    const first = await repo.post('same-key', 'Pay', lines);
    const again = await repo.post('same-key', 'Pay', lines);
    expect(again.id).toBe(first.id);
    expect(await repo.balance(b.walletAccountId)).toBe(1_000);
    await expect(repo.post('same-key', 'Pay', [
      { accountId: a.walletAccountId, amountMinor: -9_000 },
      { accountId: b.walletAccountId, amountMinor: 9_000 },
    ])).rejects.toMatchObject({ code: 'idempotency_conflict' });
  });

  it('rejects malformed entries', async () => {
    const repo = await freshRepo(kind);
    const { a, b } = await fundedPair(repo);
    await expect(repo.post('u1', 'Unbalanced', [
      { accountId: a.walletAccountId, amountMinor: -100 }, { accountId: b.walletAccountId, amountMinor: 99 },
    ])).rejects.toMatchObject({ code: 'unbalanced' });
    await expect(repo.post('u2', 'Same account twice', [
      { accountId: a.walletAccountId, amountMinor: -100 }, { accountId: a.walletAccountId, amountMinor: 100 },
    ])).rejects.toMatchObject({ code: 'duplicate_account' });
    await expect(repo.post('u3', 'Fractions', [
      { accountId: a.walletAccountId, amountMinor: -1.5 }, { accountId: b.walletAccountId, amountMinor: 1.5 },
    ])).rejects.toMatchObject({ code: 'invalid_amount' });
  });

  it('never overdraws a wallet under many simultaneous transfers', async () => {
    const repo = await freshRepo(kind);
    const { a, b } = await fundedPair(repo, 1_000);
    // 20 transfers of $1.00 race for a $10.00 balance: exactly 10 may succeed.
    const results = await Promise.allSettled(Array.from({ length: 20 }, (_, i) => repo.post(`race-${i}`, 'Race', [
      { accountId: a.walletAccountId, amountMinor: -100 },
      { accountId: b.walletAccountId, amountMinor: 100 },
    ])));
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(10);
    expect(await repo.balance(a.walletAccountId)).toBe(0);
    expect(await repo.balance(b.walletAccountId)).toBe(1_000);
    expect(await repo.trialBalance()).toEqual({ CAD: 0 });
  });

  it('rotates refresh tokens and ends the session when an old token is replayed', async () => {
    const repo = await freshRepo(kind);
    const u = await repo.createUser({ email: 'r@example.com', fullName: 'R', passwordHash: null });
    const h = (s: string) => Buffer.from(s.padEnd(32, '.'));
    const later = new Date(Date.now() + 60_000);
    const s = await repo.createSession({ userId: u.id, deviceName: 'iPhone', tokenHash: h('one'), expiresAt: later });
    expect(await repo.rotateRefreshToken(h('one'), h('two'), later)).toMatchObject({ status: 'ok', session: { id: s.id } });
    expect(await repo.rotateRefreshToken(h('nope'), h('x'), later)).toEqual({ status: 'invalid' });
    expect(await repo.rotateRefreshToken(h('one'), h('three'), later)).toMatchObject({ status: 'reused' });
    expect((await repo.getSession(s.id))?.revokedAt).not.toBeNull();
    // Even the newest token stops working once the session is ended.
    expect(await repo.rotateRefreshToken(h('two'), h('four'), later)).toEqual({ status: 'invalid' });
    expect(await repo.listSessions(u.id)).toHaveLength(0);
  });

  it('lets a person end only their own sessions', async () => {
    const repo = await freshRepo(kind);
    const u = await repo.createUser({ email: 'o@example.com', fullName: 'O', passwordHash: null });
    const other = await repo.createUser({ email: 'p@example.com', fullName: 'P', passwordHash: null });
    const later = new Date(Date.now() + 60_000);
    const s = await repo.createSession({ userId: u.id, deviceName: 'Laptop', tokenHash: Buffer.from('a'.repeat(32)), expiresAt: later });
    expect(await repo.revokeSession(other.id, s.id, 'x')).toBe(false);
    expect(await repo.revokeSession(u.id, s.id, 'logout')).toBe(true);
    expect(await repo.revokeSession(u.id, s.id, 'logout')).toBe(false);
  });

  it('hands out each passkey challenge once and never after it expires', async () => {
    const repo = await freshRepo(kind);
    const id = await repo.saveChallenge({ purpose: 'passkey_login', userId: null, challenge: 'abc', expiresAt: new Date(Date.now() + 60_000) });
    expect(await repo.takeChallenge(id, 'passkey_register')).toBeUndefined();
    const id2 = await repo.saveChallenge({ purpose: 'passkey_login', userId: null, challenge: 'def', expiresAt: new Date(Date.now() + 60_000) });
    expect(await repo.takeChallenge(id2, 'passkey_login')).toEqual({ challenge: 'def', userId: null });
    expect(await repo.takeChallenge(id2, 'passkey_login')).toBeUndefined();
    const old = await repo.saveChallenge({ purpose: 'passkey_login', userId: null, challenge: 'old', expiresAt: new Date(Date.now() - 1) });
    expect(await repo.takeChallenge(old, 'passkey_login')).toBeUndefined();
  });

  it('records only the first identity decision', async () => {
    const repo = await freshRepo(kind);
    const u = await repo.createUser({ email: 'k@example.com', fullName: 'K', passwordHash: null });
    await repo.createKycCheck({ userId: u.id, provider: 'sandbox', providerRef: 'ref-1' });
    expect(await repo.completeKycCheck('ref-1', 'verified', null)).toMatchObject({ status: 'verified' });
    expect(await repo.completeKycCheck('ref-1', 'rejected', 'late')).toMatchObject({ status: 'verified' });
    expect((await repo.getUser(u.id))?.kycStatus).toBe('verified');
    expect(await repo.completeKycCheck('missing', 'verified', null)).toBeUndefined();
  });

  if (kind === 'postgres') {
    it('enforces ledger rules inside the database itself', async () => {
      const repo = await freshRepo(kind);
      const { a } = await fundedPair(repo);
      const db = rawPool();
      await repo.record(a.id, 'test.event');
      await expect(db.query('UPDATE journal_lines SET amount_minor = 1')).rejects.toThrow(/append-only/);
      await expect(db.query('DELETE FROM journal_entries')).rejects.toThrow(/append-only/);
      await expect(db.query('DELETE FROM audit_events')).rejects.toThrow(/append-only/);
      await expect(db.query('UPDATE ledger_accounts SET balance_minor = -1 WHERE id = $1', [a.walletAccountId])).rejects.toThrow(/no_negative_wallets/);
      // A one-sided entry fails at commit, even if inserted by hand.
      const c = await db.connect();
      try {
        await c.query('BEGIN');
        const e = await c.query(`INSERT INTO journal_entries (idempotency_key, description) VALUES ('hand', 'x') RETURNING id`);
        await c.query('INSERT INTO journal_lines (entry_id, account_id, amount_minor) VALUES ($1, $2, 500)', [e.rows[0].id, a.walletAccountId]);
        await expect(c.query('COMMIT')).rejects.toThrow(/unbalanced/);
      } finally {
        await c.query('ROLLBACK').catch(() => {});
        c.release();
      }
    });
  }
});
