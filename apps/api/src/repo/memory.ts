import { randomUUID } from 'node:crypto';
import { Ledger, type EntryLine } from '../ledger/ledger';
import { baseHandle, normaliseHandle } from './handles';
import type {
  ActivityItem, AuditEvent, ChallengePurpose, KycCheck, KycStatus, Passkey, Repository, RotateResult, Session, SystemAccounts, User,
} from './types';

interface SessionRow extends Session { tokenHash: string }

/** In-memory repository for local runs and tests. Same behaviour as PostgresRepository, nothing persisted. */
export class MemoryRepository implements Repository {
  readonly ledger = new Ledger();
  readonly system: SystemAccounts;
  private users = new Map<string, User>();
  private sessions = new Map<string, SessionRow>();
  private usedTokens = new Map<string, string>();
  private passkeys = new Map<string, Passkey>();
  private challenges = new Map<string, { purpose: ChallengePurpose; userId: string | null; challenge: string; expiresAt: Date }>();
  private kyc = new Map<string, KycCheck>();
  private audit: AuditEvent[] = [];
  private waitlist = new Map<string, string | null>();

  constructor() {
    const open = (kind: 'funding_clearing' | 'payout_clearing' | 'fee_revenue') =>
      this.ledger.openAccount({ kind, currency: 'CAD', allowNegative: true }).id;
    this.system = { funding: open('funding_clearing'), payoutClearing: open('payout_clearing'), feeRevenue: open('fee_revenue') };
  }

  async createUser(input: { email: string; fullName: string; passwordHash: string | null }): Promise<User> {
    const email = input.email.toLowerCase();
    if (await this.findByEmail(email)) throw new Error('email_taken');
    const id = randomUUID();
    const wallet = this.ledger.openAccount({ kind: 'customer_wallet', currency: 'CAD', ownerId: id, allowNegative: false });
    const base = baseHandle(email);
    let handle = base;
    for (let i = 2; await this.findByHandle(handle); i++) handle = `${base}${i}`;
    const user: User = {
      id, email, fullName: input.fullName, handle, passwordHash: input.passwordHash,
      walletAccountId: wallet.id, kycStatus: 'pending', createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return { ...user };
  }

  async getUser(id: string) {
    const u = this.users.get(id);
    return u ? { ...u } : undefined;
  }

  async findByEmail(email: string) {
    const e = email.toLowerCase();
    const u = [...this.users.values()].find((x) => x.email === e);
    return u ? { ...u } : undefined;
  }

  async findByHandle(handle: string) {
    const h = normaliseHandle(handle);
    const u = [...this.users.values()].find((x) => x.handle === h);
    return u ? { ...u } : undefined;
  }

  async setKycStatus(userId: string, status: KycStatus) {
    const u = this.users.get(userId);
    if (u) u.kycStatus = status;
  }

  async post(idempotencyKey: string, description: string, lines: EntryLine[]) {
    return this.ledger.post(idempotencyKey, description, lines);
  }

  async balance(accountId: string) {
    return this.ledger.balance(accountId);
  }

  async history(accountId: string, limit: number): Promise<ActivityItem[]> {
    return this.ledger.history(accountId).slice(0, limit).map(({ entry, amountMinor }) => ({
      id: entry.id, description: entry.description, amountMinor, at: entry.createdAt,
    }));
  }

  async trialBalance() {
    return this.ledger.trialBalance();
  }

  async createSession(input: { userId: string; deviceName: string; tokenHash: Buffer; expiresAt: Date }): Promise<Session> {
    const now = new Date().toISOString();
    const row: SessionRow = {
      id: randomUUID(), userId: input.userId, deviceName: input.deviceName, createdAt: now, lastUsedAt: now,
      expiresAt: input.expiresAt.toISOString(), revokedAt: null, tokenHash: input.tokenHash.toString('hex'),
    };
    this.sessions.set(row.id, row);
    return strip(row);
  }

  async getSession(id: string) {
    const s = this.sessions.get(id);
    return s ? strip(s) : undefined;
  }

  async rotateRefreshToken(oldHash: Buffer, newHash: Buffer, newExpiresAt: Date): Promise<RotateResult> {
    const old = oldHash.toString('hex');
    const reusedSession = this.usedTokens.get(old);
    if (reusedSession) {
      const s = this.sessions.get(reusedSession)!;
      if (!s.revokedAt) s.revokedAt = new Date().toISOString();
      return { status: 'reused', session: strip(s) };
    }
    const s = [...this.sessions.values()].find((x) => x.tokenHash === old);
    if (!s || s.revokedAt || new Date(s.expiresAt) <= new Date()) return { status: 'invalid' };
    this.usedTokens.set(old, s.id);
    s.tokenHash = newHash.toString('hex');
    s.lastUsedAt = new Date().toISOString();
    s.expiresAt = newExpiresAt.toISOString();
    return { status: 'ok', session: strip(s) };
  }

  async listSessions(userId: string) {
    const now = new Date();
    return [...this.sessions.values()]
      .filter((s) => s.userId === userId && !s.revokedAt && new Date(s.expiresAt) > now)
      .sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt))
      .map(strip);
  }

  async revokeSession(userId: string, sessionId: string) {
    const s = this.sessions.get(sessionId);
    if (!s || s.userId !== userId || s.revokedAt) return false;
    s.revokedAt = new Date().toISOString();
    return true;
  }

  async addPasskey(p: Omit<Passkey, 'createdAt' | 'lastUsedAt'>) {
    if (this.passkeys.has(p.id)) throw new Error('passkey_exists');
    this.passkeys.set(p.id, { ...p, createdAt: new Date().toISOString(), lastUsedAt: null });
  }

  async getPasskey(id: string) {
    const p = this.passkeys.get(id);
    return p ? { ...p } : undefined;
  }

  async listPasskeys(userId: string) {
    return [...this.passkeys.values()].filter((p) => p.userId === userId).map((p) => ({ ...p }));
  }

  async markPasskeyUsed(id: string, counter: number) {
    const p = this.passkeys.get(id);
    if (p) { p.counter = counter; p.lastUsedAt = new Date().toISOString(); }
  }

  async deletePasskey(userId: string, id: string) {
    const p = this.passkeys.get(id);
    if (!p || p.userId !== userId) return false;
    return this.passkeys.delete(id);
  }

  async saveChallenge(input: { purpose: ChallengePurpose; userId: string | null; challenge: string; expiresAt: Date }) {
    const id = randomUUID();
    this.challenges.set(id, input);
    return id;
  }

  async takeChallenge(id: string, purpose: ChallengePurpose) {
    const c = this.challenges.get(id);
    this.challenges.delete(id);
    if (!c || c.purpose !== purpose || c.expiresAt <= new Date()) return undefined;
    return { challenge: c.challenge, userId: c.userId };
  }

  async createKycCheck(input: { userId: string; provider: string; providerRef: string }): Promise<KycCheck> {
    const check: KycCheck = {
      id: randomUUID(), ...input, status: 'started', reason: null, createdAt: new Date().toISOString(), completedAt: null,
    };
    this.kyc.set(check.id, check);
    return { ...check };
  }

  async latestKycCheck(userId: string) {
    const all = [...this.kyc.values()].filter((k) => k.userId === userId);
    const last = all[all.length - 1];
    return last ? { ...last } : undefined;
  }

  async completeKycCheck(providerRef: string, status: 'verified' | 'rejected', reason: string | null) {
    const check = [...this.kyc.values()].find((k) => k.providerRef === providerRef);
    if (!check) return undefined;
    if (check.status === 'started') {
      check.status = status;
      check.reason = reason;
      check.completedAt = new Date().toISOString();
      await this.setKycStatus(check.userId, status);
    }
    return { ...check };
  }

  async joinWaitlist(email: string, source: string | null) {
    if (this.waitlist.has(email)) return false;
    this.waitlist.set(email, source);
    return true;
  }

  async waitlistCount() {
    return this.waitlist.size;
  }

  async record(actor: string | null, action: string, detail: Record<string, unknown> = {}) {
    this.audit.push({ at: new Date().toISOString(), actor, action, detail });
  }

  async auditFor(actor: string) {
    return this.audit.filter((e) => e.actor === actor);
  }

  async close() {}
}

function strip({ tokenHash: _t, ...s }: SessionRow): Session {
  return { ...s };
}
