import { randomUUID } from 'node:crypto';
import { Ledger, type Account } from './ledger/ledger';

export interface User {
  id: string;
  email: string;
  fullName: string;
  handle: string;
  passwordHash: string;
  walletAccountId: string;
  /** KYC must be 'verified' before money can leave the wallet (FINTRAC). */
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface AuditEvent {
  at: string;
  actor: string;
  action: string;
  detail: Record<string, unknown>;
}

/**
 * Development store. Production uses PostgreSQL (see db/migrations) behind the same methods.
 */
export class Store {
  readonly ledger = new Ledger();
  readonly funding: Account;
  readonly payoutClearing: Account;
  readonly feeRevenue: Account;
  private users = new Map<string, User>();
  private audit: AuditEvent[] = [];

  constructor() {
    this.funding = this.ledger.openAccount({ kind: 'funding_clearing', currency: 'CAD', allowNegative: true });
    this.payoutClearing = this.ledger.openAccount({ kind: 'payout_clearing', currency: 'CAD', allowNegative: true });
    this.feeRevenue = this.ledger.openAccount({ kind: 'fee_revenue', currency: 'CAD', allowNegative: true });
  }

  createUser(input: { email: string; fullName: string; passwordHash: string }): User {
    const email = input.email.toLowerCase();
    if (this.findByEmail(email)) throw new Error('email_taken');
    const id = randomUUID();
    const wallet = this.ledger.openAccount({ kind: 'customer_wallet', currency: 'CAD', ownerId: id, allowNegative: false });
    const local = email.split('@')[0]!.replace(/[^a-z0-9]/g, '').slice(0, 20);
    const base = local.length >= 3 ? local : `${local}user`;
    let handle = base;
    for (let i = 2; this.findByHandle(handle); i++) handle = `${base}${i}`;
    const user: User = {
      id, email, fullName: input.fullName, handle, passwordHash: input.passwordHash,
      walletAccountId: wallet.id, kycStatus: 'pending', createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  findByEmail(email: string): User | undefined {
    const e = email.toLowerCase();
    return [...this.users.values()].find((u) => u.email === e);
  }

  findByHandle(handle: string): User | undefined {
    const h = handle.replace(/^@/, '').toLowerCase();
    return [...this.users.values()].find((u) => u.handle === h);
  }

  record(actor: string, action: string, detail: Record<string, unknown> = {}): void {
    // Append-only audit trail. Never contains passwords, tokens or full card numbers.
    this.audit.push({ at: new Date().toISOString(), actor, action, detail });
  }

  auditFor(actor: string): AuditEvent[] {
    return this.audit.filter((e) => e.actor === actor);
  }
}
