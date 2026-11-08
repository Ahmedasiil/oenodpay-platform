import pg, { type Pool, type PoolClient } from 'pg';
import { LedgerError, requestHash, validateLines, type EntryLine, type JournalEntry } from '../ledger/ledger';
import { baseHandle, normaliseHandle } from './handles';
import type {
  ActivityItem, AuditEvent, ChallengePurpose, KycCheck, KycStatus, Passkey, Repository, RotateResult, Session, SystemAccounts, User,
} from './types';

// bigint columns hold money in minor units. Refuse anything that would lose precision in JavaScript.
pg.types.setTypeParser(20, (v) => {
  const n = Number(v);
  if (!Number.isSafeInteger(n)) throw new Error('bigint value out of safe range');
  return n;
});

const RETRYABLE = new Set(['40001', '40P01']); // serialization failure, deadlock
// Two requests racing for the same handle or idempotency key: retrying resolves it cleanly.
const RACY_UNIQUE = new Set(['users_handle_key', 'journal_entries_idempotency_key_key']);
const iso = (d: Date | null) => (d ? d.toISOString() : null);

/**
 * PostgreSQL repository. Every money movement runs in a SERIALIZABLE transaction, locks the
 * accounts it touches in a fixed order, and is retried automatically if Postgres detects a conflict.
 * The schema enforces the same rules again (balanced entries, no negative wallets, append-only ledger).
 */
export class PostgresRepository implements Repository {
  private constructor(private pool: Pool, readonly system: SystemAccounts) {}

  static async connect(pool: Pool): Promise<PostgresRepository> {
    const ensure = async (kind: string) => {
      const { rows } = await pool.query<{ id: string }>(
        `INSERT INTO ledger_accounts (kind, currency, allow_negative) VALUES ($1, 'CAD', true)
         ON CONFLICT (kind, currency) WHERE owner_id IS NULL DO UPDATE SET kind = EXCLUDED.kind RETURNING id`,
        [kind],
      );
      return rows[0]!.id;
    };
    return new PostgresRepository(pool, {
      funding: await ensure('funding_clearing'),
      payoutClearing: await ensure('payout_clearing'),
      feeRevenue: await ensure('fee_revenue'),
    });
  }

  private async tx<T>(fn: (c: PoolClient) => Promise<T>, isolation = 'READ COMMITTED'): Promise<T> {
    for (let attempt = 1; ; attempt++) {
      const client = await this.pool.connect();
      try {
        await client.query(`BEGIN ISOLATION LEVEL ${isolation}`);
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        const code = (err as { code?: string }).code;
        const constraint = (err as { constraint?: string }).constraint ?? '';
        const raceOnUniqueKey = code === '23505' && RACY_UNIQUE.has(constraint);
        if ((RETRYABLE.has(code ?? '') || raceOnUniqueKey) && attempt < 6) {
          await new Promise((r) => setTimeout(r, 5 * attempt + Math.random() * 20));
          continue;
        }
        throw err;
      } finally {
        client.release();
      }
    }
  }

  // People ------------------------------------------------------------------

  private userSql = `SELECT u.id, u.email::text AS email, u.full_name, u.handle, u.password_hash, u.kyc_status, u.created_at, a.id AS wallet_id
    FROM users u JOIN ledger_accounts a ON a.owner_id = u.id AND a.kind = 'customer_wallet' AND a.currency = 'CAD'`;

  private toUser(r: Record<string, unknown>): User {
    return {
      id: r.id as string, email: r.email as string, fullName: r.full_name as string, handle: r.handle as string,
      passwordHash: (r.password_hash as string | null) ?? null, walletAccountId: r.wallet_id as string,
      kycStatus: r.kyc_status as KycStatus, createdAt: iso(r.created_at as Date)!,
    };
  }

  async createUser(input: { email: string; fullName: string; passwordHash: string | null }): Promise<User> {
    const email = input.email.toLowerCase();
    const base = baseHandle(email);
    try {
      return await this.tx(async (c) => {
        const taken = new Set((await c.query<{ handle: string }>(
          `SELECT handle FROM users WHERE handle = $1 OR handle ~ ('^' || $1 || '[0-9]+$')`, [base],
        )).rows.map((r) => r.handle));
        let handle = base;
        for (let i = 2; taken.has(handle); i++) handle = `${base}${i}`;
        const { rows } = await c.query<{ id: string }>(
          'INSERT INTO users (email, full_name, handle, password_hash) VALUES ($1, $2, $3, $4) RETURNING id',
          [email, input.fullName, handle, input.passwordHash],
        );
        await c.query(`INSERT INTO ledger_accounts (kind, currency, owner_id, allow_negative) VALUES ('customer_wallet', 'CAD', $1, false)`, [rows[0]!.id]);
        const u = await c.query(`${this.userSql} WHERE u.id = $1`, [rows[0]!.id]);
        return this.toUser(u.rows[0]);
      });
    } catch (err) {
      if ((err as { code?: string; constraint?: string }).constraint === 'users_email_key') throw new Error('email_taken');
      throw err;
    }
  }

  async getUser(id: string) {
    if (!isUuid(id)) return undefined;
    const { rows } = await this.pool.query(`${this.userSql} WHERE u.id = $1`, [id]);
    return rows[0] ? this.toUser(rows[0]) : undefined;
  }

  async findByEmail(email: string) {
    const { rows } = await this.pool.query(`${this.userSql} WHERE u.email = $1`, [email.toLowerCase()]);
    return rows[0] ? this.toUser(rows[0]) : undefined;
  }

  async findByHandle(handle: string) {
    const { rows } = await this.pool.query(`${this.userSql} WHERE u.handle = $1`, [normaliseHandle(handle)]);
    return rows[0] ? this.toUser(rows[0]) : undefined;
  }

  async setKycStatus(userId: string, status: KycStatus) {
    await this.pool.query('UPDATE users SET kyc_status = $2 WHERE id = $1', [userId, status]);
  }

  // Ledger ------------------------------------------------------------------

  async post(idempotencyKey: string, description: string, lines: EntryLine[]): Promise<JournalEntry> {
    const hash = requestHash(description, lines);
    return this.tx(async (c) => {
      const existing = await this.entryByKey(c, idempotencyKey);
      if (existing) {
        if (existing.requestHash !== hash) throw new LedgerError('idempotency_conflict', 'This idempotency key was used for a different request');
        return existing;
      }
      validateLines(lines);
      const ids = lines.map((l) => l.accountId);
      if (!ids.every(isUuid)) throw new LedgerError('unknown_account', 'Account not found');
      // Lock in id order so two transfers between the same wallets can never deadlock.
      const { rows: accounts } = await c.query<{ id: string; currency: string; allow_negative: boolean; balance_minor: number }>(
        'SELECT id, currency, allow_negative, balance_minor FROM ledger_accounts WHERE id = ANY($1::uuid[]) ORDER BY id FOR UPDATE',
        [ids],
      );
      if (accounts.length !== ids.length) throw new LedgerError('unknown_account', 'Account not found');
      if (new Set(accounts.map((a) => a.currency)).size !== 1) {
        throw new LedgerError('currency_mismatch', 'Convert currency through FX accounts, not in one entry');
      }
      const byId = new Map(accounts.map((a) => [a.id, a]));
      for (const line of lines) {
        const a = byId.get(line.accountId)!;
        if (!a.allow_negative && a.balance_minor + line.amountMinor < 0) {
          throw new LedgerError('insufficient_funds', 'Not enough money in the wallet');
        }
      }
      const { rows } = await c.query<{ id: string; created_at: Date }>(
        'INSERT INTO journal_entries (idempotency_key, request_hash, description) VALUES ($1, $2, $3) RETURNING id, created_at',
        [idempotencyKey, hash, description],
      );
      const entry = rows[0]!;
      await c.query(
        'INSERT INTO journal_lines (entry_id, account_id, amount_minor) SELECT $1, * FROM unnest($2::uuid[], $3::bigint[])',
        [entry.id, ids, lines.map((l) => l.amountMinor)],
      );
      await c.query(
        `UPDATE ledger_accounts a SET balance_minor = a.balance_minor + d.amount
         FROM unnest($1::uuid[], $2::bigint[]) AS d(id, amount) WHERE a.id = d.id`,
        [ids, lines.map((l) => l.amountMinor)],
      );
      return { id: entry.id, idempotencyKey, requestHash: hash, description, lines, createdAt: entry.created_at.toISOString() };
    }, 'SERIALIZABLE');
  }

  private async entryByKey(c: PoolClient, key: string): Promise<JournalEntry | undefined> {
    const { rows } = await c.query<{ id: string; request_hash: string; description: string; created_at: Date }>(
      'SELECT id, request_hash, description, created_at FROM journal_entries WHERE idempotency_key = $1', [key],
    );
    const e = rows[0];
    if (!e) return undefined;
    const lines = await c.query<{ account_id: string; amount_minor: number }>(
      'SELECT account_id, amount_minor FROM journal_lines WHERE entry_id = $1', [e.id],
    );
    return {
      id: e.id, idempotencyKey: key, requestHash: e.request_hash, description: e.description, createdAt: e.created_at.toISOString(),
      lines: lines.rows.map((l) => ({ accountId: l.account_id, amountMinor: l.amount_minor })),
    };
  }

  async balance(accountId: string) {
    const { rows } = isUuid(accountId)
      ? await this.pool.query<{ balance_minor: number }>('SELECT balance_minor FROM ledger_accounts WHERE id = $1', [accountId])
      : { rows: [] };
    if (!rows[0]) throw new LedgerError('unknown_account', 'Account not found');
    return rows[0].balance_minor;
  }

  async history(accountId: string, limit: number): Promise<ActivityItem[]> {
    const { rows } = await this.pool.query<{ id: string; description: string; amount_minor: number; created_at: Date }>(
      `SELECT e.id, e.description, l.amount_minor, e.created_at FROM journal_lines l
       JOIN journal_entries e ON e.id = l.entry_id WHERE l.account_id = $1 ORDER BY e.created_at DESC, e.id DESC LIMIT $2`,
      [accountId, limit],
    );
    return rows.map((r) => ({ id: r.id, description: r.description, amountMinor: r.amount_minor, at: r.created_at.toISOString() }));
  }

  async trialBalance() {
    const { rows } = await this.pool.query<{ currency: string; total: number }>(
      'SELECT currency, sum(balance_minor)::bigint AS total FROM ledger_accounts GROUP BY currency',
    );
    return Object.fromEntries(rows.map((r) => [r.currency, r.total]));
  }

  // Sessions ------------------------------------------------------------------

  private toSession(r: Record<string, unknown>): Session {
    return {
      id: r.id as string, userId: r.user_id as string, deviceName: r.device_name as string,
      createdAt: iso(r.created_at as Date)!, lastUsedAt: iso(r.last_used_at as Date)!,
      expiresAt: iso(r.expires_at as Date)!, revokedAt: iso(r.revoked_at as Date | null),
    };
  }

  private sessionCols = 'id, user_id, device_name, created_at, last_used_at, expires_at, revoked_at';

  async createSession(input: { userId: string; deviceName: string; tokenHash: Buffer; expiresAt: Date }) {
    const { rows } = await this.pool.query(
      `INSERT INTO sessions (user_id, device_name, token_hash, expires_at) VALUES ($1, $2, $3, $4) RETURNING ${this.sessionCols}`,
      [input.userId, input.deviceName, input.tokenHash, input.expiresAt],
    );
    return this.toSession(rows[0]);
  }

  async getSession(id: string) {
    if (!isUuid(id)) return undefined;
    const { rows } = await this.pool.query(`SELECT ${this.sessionCols} FROM sessions WHERE id = $1`, [id]);
    return rows[0] ? this.toSession(rows[0]) : undefined;
  }

  async rotateRefreshToken(oldHash: Buffer, newHash: Buffer, newExpiresAt: Date): Promise<RotateResult> {
    return this.tx(async (c) => {
      const reused = await c.query('SELECT session_id FROM used_refresh_tokens WHERE token_hash = $1', [oldHash]);
      if (reused.rows[0]) {
        const { rows } = await c.query(
          `UPDATE sessions SET revoked_at = coalesce(revoked_at, now()), revoke_reason = coalesce(revoke_reason, 'refresh_token_reuse')
           WHERE id = $1 RETURNING ${this.sessionCols}`, [reused.rows[0].session_id],
        );
        return { status: 'reused' as const, session: this.toSession(rows[0]) };
      }
      const { rows } = await c.query(
        `SELECT ${this.sessionCols} FROM sessions WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now() FOR UPDATE`, [oldHash],
      );
      if (!rows[0]) return { status: 'invalid' as const };
      await c.query('INSERT INTO used_refresh_tokens (token_hash, session_id) VALUES ($1, $2)', [oldHash, rows[0].id]);
      const updated = await c.query(
        `UPDATE sessions SET token_hash = $2, expires_at = $3, last_used_at = now() WHERE id = $1 RETURNING ${this.sessionCols}`,
        [rows[0].id, newHash, newExpiresAt],
      );
      return { status: 'ok' as const, session: this.toSession(updated.rows[0]) };
    });
  }

  async listSessions(userId: string) {
    const { rows } = await this.pool.query(
      `SELECT ${this.sessionCols} FROM sessions WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > now() ORDER BY last_used_at DESC`,
      [userId],
    );
    return rows.map((r) => this.toSession(r));
  }

  async revokeSession(userId: string, sessionId: string, reason: string) {
    if (!isUuid(sessionId)) return false;
    const { rowCount } = await this.pool.query(
      'UPDATE sessions SET revoked_at = now(), revoke_reason = $3 WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL',
      [sessionId, userId, reason],
    );
    return (rowCount ?? 0) > 0;
  }

  // Passkeys ------------------------------------------------------------------

  private toPasskey(r: Record<string, unknown>): Passkey {
    return {
      id: r.id as string, userId: r.user_id as string, publicKey: new Uint8Array(r.public_key as Buffer),
      counter: r.counter as number, transports: r.transports as string[], deviceType: r.device_type as string,
      backedUp: r.backed_up as boolean, nickname: r.nickname as string,
      createdAt: iso(r.created_at as Date)!, lastUsedAt: iso(r.last_used_at as Date | null),
    };
  }

  async addPasskey(p: Omit<Passkey, 'createdAt' | 'lastUsedAt'>) {
    try {
      await this.pool.query(
        `INSERT INTO passkeys (id, user_id, public_key, counter, transports, device_type, backed_up, nickname)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [p.id, p.userId, Buffer.from(p.publicKey), p.counter, p.transports, p.deviceType, p.backedUp, p.nickname],
      );
    } catch (err) {
      if ((err as { code?: string }).code === '23505') throw new Error('passkey_exists');
      throw err;
    }
  }

  async getPasskey(id: string) {
    const { rows } = await this.pool.query('SELECT * FROM passkeys WHERE id = $1', [id]);
    return rows[0] ? this.toPasskey(rows[0]) : undefined;
  }

  async listPasskeys(userId: string) {
    const { rows } = await this.pool.query('SELECT * FROM passkeys WHERE user_id = $1 ORDER BY created_at', [userId]);
    return rows.map((r) => this.toPasskey(r));
  }

  async markPasskeyUsed(id: string, counter: number) {
    await this.pool.query('UPDATE passkeys SET counter = $2, last_used_at = now() WHERE id = $1', [id, counter]);
  }

  async deletePasskey(userId: string, id: string) {
    const { rowCount } = await this.pool.query('DELETE FROM passkeys WHERE id = $1 AND user_id = $2', [id, userId]);
    return (rowCount ?? 0) > 0;
  }

  async saveChallenge(input: { purpose: ChallengePurpose; userId: string | null; challenge: string; expiresAt: Date }) {
    await this.pool.query('DELETE FROM auth_challenges WHERE expires_at < now()');
    const { rows } = await this.pool.query<{ id: string }>(
      'INSERT INTO auth_challenges (purpose, user_id, challenge, expires_at) VALUES ($1, $2, $3, $4) RETURNING id',
      [input.purpose, input.userId, input.challenge, input.expiresAt],
    );
    return rows[0]!.id;
  }

  async takeChallenge(id: string, purpose: ChallengePurpose) {
    if (!isUuid(id)) return undefined;
    const { rows } = await this.pool.query<{ challenge: string; user_id: string | null; purpose: string; expires_at: Date }>(
      'DELETE FROM auth_challenges WHERE id = $1 RETURNING challenge, user_id, purpose, expires_at', [id],
    );
    const c = rows[0];
    if (!c || c.purpose !== purpose || c.expires_at <= new Date()) return undefined;
    return { challenge: c.challenge, userId: c.user_id };
  }

  // Identity verification -------------------------------------------------------

  private toKyc(r: Record<string, unknown>): KycCheck {
    return {
      id: r.id as string, userId: r.user_id as string, provider: r.provider as string, providerRef: r.provider_ref as string,
      status: r.status as KycCheck['status'], reason: (r.reason as string | null) ?? null,
      createdAt: iso(r.created_at as Date)!, completedAt: iso(r.completed_at as Date | null),
    };
  }

  async createKycCheck(input: { userId: string; provider: string; providerRef: string }) {
    const { rows } = await this.pool.query(
      'INSERT INTO kyc_checks (user_id, provider, provider_ref) VALUES ($1, $2, $3) RETURNING *',
      [input.userId, input.provider, input.providerRef],
    );
    return this.toKyc(rows[0]);
  }

  async latestKycCheck(userId: string) {
    const { rows } = await this.pool.query('SELECT * FROM kyc_checks WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1', [userId]);
    return rows[0] ? this.toKyc(rows[0]) : undefined;
  }

  async completeKycCheck(providerRef: string, status: 'verified' | 'rejected', reason: string | null) {
    return this.tx(async (c) => {
      const { rows } = await c.query('SELECT * FROM kyc_checks WHERE provider_ref = $1 FOR UPDATE', [providerRef]);
      if (!rows[0]) return undefined;
      if (rows[0].status !== 'started') return this.toKyc(rows[0]);
      const updated = await c.query(
        'UPDATE kyc_checks SET status = $2, reason = $3, completed_at = now() WHERE id = $1 RETURNING *', [rows[0].id, status, reason],
      );
      await c.query('UPDATE users SET kyc_status = $2 WHERE id = $1', [rows[0].user_id, status]);
      return this.toKyc(updated.rows[0]);
    });
  }

  // Early access -----------------------------------------------------------------

  async joinWaitlist(email: string, source: string | null) {
    const { rowCount } = await this.pool.query(
      'INSERT INTO waitlist (email, source) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING', [email, source],
    );
    return rowCount === 1;
  }

  async ping() {
    await this.pool.query('SELECT 1');
  }

  async waitlistCount() {
    const { rows } = await this.pool.query<{ n: string }>('SELECT count(*) AS n FROM waitlist');
    return Number(rows[0]!.n);
  }

  async saveContactMessage(input: { name: string; email: string; topic: string; message: string }) {
    const { rows } = await this.pool.query<{ id: string }>(
      'INSERT INTO contact_messages (name, email, topic, message) VALUES ($1, $2, $3, $4) RETURNING id',
      [input.name, input.email, input.topic, input.message],
    );
    return `OP-${String(rows[0]!.id).padStart(6, '0')}`;
  }

  // Audit -----------------------------------------------------------------------

  async record(actor: string | null, action: string, detail: Record<string, unknown> = {}) {
    await this.pool.query('INSERT INTO audit_events (actor, action, detail) VALUES ($1, $2, $3)', [actor, action, detail]);
  }

  async auditFor(actor: string): Promise<AuditEvent[]> {
    const { rows } = await this.pool.query<{ at: Date; actor: string; action: string; detail: Record<string, unknown> }>(
      'SELECT at, actor, action, detail FROM audit_events WHERE actor = $1 ORDER BY id', [actor],
    );
    return rows.map((r) => ({ at: r.at.toISOString(), actor: r.actor, action: r.action, detail: r.detail }));
  }

  async close() {
    await this.pool.end();
  }
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}
