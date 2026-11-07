import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import {
  CORRIDORS, QuoteError, loginSchema, quoteSchema, quoteTransfer, registerSchema, walletTransferSchema,
} from '@oenodpay/shared';
import type { Config } from './config';
import { Store, type User } from './store';
import { LedgerError } from './ledger/ledger';
import { hashPassword, verifyPassword } from './auth/password';
import { TokenService } from './auth/tokens';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}

export async function buildApp(config: Config, store = new Store()): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.NODE_ENV === 'test' ? false : {
      // Never log secrets or personal data.
      redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password'],
    },
    bodyLimit: 64 * 1024,
    trustProxy: true,
  });
  const tokens = new TokenService(config.JWT_SECRET);

  await app.register(helmet);
  await app.register(cors, { origin: config.corsOrigins, credentials: false });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError) return reply.status(400).send({ error: 'invalid_request', issues: err.issues });
    if (err instanceof LedgerError) return reply.status(422).send({ error: err.code, message: err.message });
    if (err instanceof QuoteError) return reply.status(422).send({ error: 'quote_unavailable', message: err.message });
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 429) return reply.status(429).send({ error: 'too_many_requests' });
    if (status === 401) return reply.status(401).send({ error: 'unauthorized' });
    if (status && status >= 400 && status < 500) return reply.status(status).send({ error: 'bad_request' });
    app.log.error(err);
    return reply.status(500).send({ error: 'internal_error' });
  });

  const requireUser = async (req: FastifyRequest) => {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    try {
      const userId = await tokens.verify(token);
      const user = store.getUser(userId);
      if (!user) throw new Error('no user');
      req.user = user;
    } catch {
      throw Object.assign(new Error('unauthorized'), { statusCode: 401 });
    }
  };

  const publicUser = (u: User) => ({
    id: u.id, email: u.email, fullName: u.fullName, handle: u.handle, kycStatus: u.kycStatus,
  });

  app.get('/health', async () => ({ status: 'ok' }));

  // Stricter limits on sign-in endpoints to slow down password guessing.
  const authLimit = { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } };

  app.post('/v1/auth/register', authLimit, async (req, reply) => {
    const input = registerSchema.parse(req.body);
    if (store.findByEmail(input.email)) {
      return reply.status(409).send({ error: 'email_taken' });
    }
    const user = store.createUser({ email: input.email, fullName: input.fullName, passwordHash: await hashPassword(input.password) });
    store.record(user.id, 'user.registered');
    return reply.status(201).send({ user: publicUser(user), accessToken: await tokens.issue(user.id) });
  });

  app.post('/v1/auth/login', authLimit, async (req, reply) => {
    const input = loginSchema.parse(req.body);
    const user = store.findByEmail(input.email);
    // Same response for unknown email and wrong password, so attackers can't find accounts.
    const ok = user ? await verifyPassword(input.password, user.passwordHash) : false;
    if (!user || !ok) {
      if (user) store.record(user.id, 'auth.login_failed', { ip: req.ip });
      return reply.status(401).send({ error: 'invalid_credentials' });
    }
    store.record(user.id, 'auth.login', { ip: req.ip });
    return { user: publicUser(user), accessToken: await tokens.issue(user.id) };
  });

  app.get('/v1/me', { preHandler: requireUser }, async (req) => ({ user: publicUser(req.user!) }));

  app.get('/v1/wallet', { preHandler: requireUser }, async (req) => {
    const user = req.user!;
    return {
      currency: 'CAD',
      balanceMinor: store.ledger.balance(user.walletAccountId),
      activity: store.ledger.history(user.walletAccountId).slice(0, 50).map(({ entry, amountMinor }) => ({
        id: entry.id, description: entry.description, amountMinor, at: entry.createdAt,
      })),
    };
  });

  app.post('/v1/transfers/wallet', { preHandler: requireUser }, async (req, reply) => {
    const user = req.user!;
    const input = walletTransferSchema.parse(req.body);
    const idempotencyKey = req.headers['idempotency-key'];
    if (typeof idempotencyKey !== 'string' || idempotencyKey.length < 8 || idempotencyKey.length > 100) {
      return reply.status(400).send({ error: 'idempotency_key_required' });
    }
    if (user.kycStatus !== 'verified') {
      return reply.status(403).send({ error: 'kyc_required', message: 'Verify your identity before sending money' });
    }
    const recipient = store.findByHandle(input.toHandle);
    if (!recipient || recipient.id === user.id) {
      return reply.status(404).send({ error: 'recipient_not_found' });
    }
    const entry = store.ledger.post(`${user.id}:${idempotencyKey}`, `Transfer to @${recipient.handle}`, [
      { accountId: user.walletAccountId, amountMinor: -input.amountMinor },
      { accountId: recipient.walletAccountId, amountMinor: input.amountMinor },
    ]);
    store.record(user.id, 'transfer.wallet', { entryId: entry.id, to: recipient.id, amountMinor: input.amountMinor });
    return reply.status(201).send({ transferId: entry.id, balanceMinor: store.ledger.balance(user.walletAccountId) });
  });

  app.get('/v1/corridors', async () => ({ corridors: CORRIDORS, sampleData: true }));

  app.post('/v1/quotes', { preHandler: requireUser }, async (req) => {
    const input = quoteSchema.parse(req.body);
    return { quote: quoteTransfer(input.countryCode, input.methodId, input.amountMinor), sampleData: true };
  });

  return app;
}
