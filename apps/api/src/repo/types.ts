import type { EntryLine, JournalEntry } from '../ledger/ledger';

export type KycStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  fullName: string;
  handle: string;
  /** Null for people who sign in only with passkeys. */
  passwordHash: string | null;
  walletAccountId: string;
  /** Must be 'verified' before money can leave the wallet (FINTRAC). */
  kycStatus: KycStatus;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  deviceName: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

export type RotateResult =
  | { status: 'ok'; session: Session }
  | { status: 'reused'; session: Session }
  | { status: 'invalid' };

export interface Passkey {
  id: string;
  userId: string;
  publicKey: Uint8Array;
  counter: number;
  transports: string[];
  deviceType: string;
  backedUp: boolean;
  nickname: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export type ChallengePurpose = 'passkey_register' | 'passkey_login';

export interface KycCheck {
  id: string;
  userId: string;
  provider: string;
  providerRef: string;
  status: 'started' | 'verified' | 'rejected';
  reason: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface AuditEvent {
  at: string;
  actor: string | null;
  action: string;
  detail: Record<string, unknown>;
}

export interface ActivityItem {
  id: string;
  description: string;
  amountMinor: number;
  at: string;
}

export interface SystemAccounts {
  funding: string;
  payoutClearing: string;
  feeRevenue: string;
}

/**
 * Everything the API stores goes through this interface. There are two implementations:
 * MemoryRepository for quick local runs and tests, and PostgresRepository for real use.
 * Both must behave the same; the shared contract tests in repository.test.ts check that.
 */
export interface Repository {
  readonly system: SystemAccounts;

  // People
  createUser(input: { email: string; fullName: string; passwordHash: string | null }): Promise<User>;
  getUser(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByHandle(handle: string): Promise<User | undefined>;
  setKycStatus(userId: string, status: KycStatus): Promise<void>;

  // Ledger
  post(idempotencyKey: string, description: string, lines: EntryLine[]): Promise<JournalEntry>;
  balance(accountId: string): Promise<number>;
  history(accountId: string, limit: number): Promise<ActivityItem[]>;
  trialBalance(): Promise<Record<string, number>>;

  // Sessions and refresh tokens (only hashes are passed in)
  createSession(input: { userId: string; deviceName: string; tokenHash: Buffer; expiresAt: Date }): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  rotateRefreshToken(oldHash: Buffer, newHash: Buffer, newExpiresAt: Date): Promise<RotateResult>;
  listSessions(userId: string): Promise<Session[]>;
  revokeSession(userId: string, sessionId: string, reason: string): Promise<boolean>;

  // Passkeys
  addPasskey(passkey: Omit<Passkey, 'createdAt' | 'lastUsedAt'>): Promise<void>;
  getPasskey(id: string): Promise<Passkey | undefined>;
  listPasskeys(userId: string): Promise<Passkey[]>;
  markPasskeyUsed(id: string, counter: number): Promise<void>;
  deletePasskey(userId: string, id: string): Promise<boolean>;
  saveChallenge(input: { purpose: ChallengePurpose; userId: string | null; challenge: string; expiresAt: Date }): Promise<string>;
  /** Returns the challenge once, then forgets it. Expired or wrong-purpose challenges return undefined. */
  takeChallenge(id: string, purpose: ChallengePurpose): Promise<{ challenge: string; userId: string | null } | undefined>;

  // Identity verification
  createKycCheck(input: { userId: string; provider: string; providerRef: string }): Promise<KycCheck>;
  latestKycCheck(userId: string): Promise<KycCheck | undefined>;
  /** Records the vendor's decision and updates the person's status in one step. Only the first decision counts. */
  completeKycCheck(providerRef: string, status: 'verified' | 'rejected', reason: string | null): Promise<KycCheck | undefined>;

  // Early access
  /** Adds an email to the launch list. Returns false if it was already there. */
  joinWaitlist(email: string, source: string | null): Promise<boolean>;
  waitlistCount(): Promise<number>;

  // Audit trail (append-only; never passwords, tokens or full card numbers)
  record(actor: string | null, action: string, detail?: Record<string, unknown>): Promise<void>;
  auditFor(actor: string): Promise<AuditEvent[]>;

  close(): Promise<void>;
}
