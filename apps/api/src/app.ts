import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import { z, ZodError } from 'zod';
import {
  CORRIDORS, QuoteError, loginSchema, quoteSchema, waitlistSchema, quoteTransfer, registerSchema, walletTransferSchema,
} from '@oenodpay/shared';
import type { Config } from './config';
import { LedgerError } from './ledger/ledger';
import { hashPassword, verifyPassword } from './auth/password';
import { ACCESS_TOKEN_TTL_SECONDS, TokenService, hashRefreshToken, newRefreshToken } from './auth/tokens';
import { PasskeyError, PasskeyService } from './auth/passkeys';
import { SandboxKycProvider, type KycProvider } from './kyc/provider';
import { signWebhook, verifyWebhook } from './kyc/webhook';
import { MemoryRepository } from './repo/memory';
import type { Repository, Session, User } from './repo/types';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    session?: Session;
    rawBody?: string;
  }
}

const deviceSchema = z.object({ deviceName: z.string().trim().min(1).max(60).optional() });
const refreshSchema = z.object({ refreshToken: z.string().min(20).max(200) });
const passkeyVerifySchema = z.object({
  challengeId: z.string().min(1).max(100),
  // The WebAuthn response is checked field by field by the verifier itself.
  response: z.object({ id: z.string().min(1).max(1024) }).passthrough(),
  nickname: z.string().trim().min(1).max(40).optional(),
  deviceName: z.string().trim().min(1).max(60).optional(),
});
const kycWebhookSchema = z.object({
  providerRef: z.string().min(1).max(200),
  decision: z.enum(['verified', 'rejected']),
  reason: z.string().max(200).nullable().optional(),
});

// A real scrypt hash of a random password, so a login for an unknown email takes as long as a real one.
const DUMMY_HASH = hashPassword(crypto.randomUUID());

export async function buildApp(
  config: Config,
  repo: Repository = new MemoryRepository(),
  kyc: KycProvider = new SandboxKycProvider(),
): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.NODE_ENV === 'test' ? false : {
      // Never log secrets or personal data.
      redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'req.body.refreshToken'],
    },
    bodyLimit: 64 * 1024,
    trustProxy: true,
  });
  const tokens = new TokenService(config.JWT_SECRET);
  const passkeys = new PasskeyService(repo, config);

  await app.register(helmet);
  await app.register(cors, { origin: config.corsOrigins, credentials: false });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  // Keep the exact request text so webhook signatures can be checked byte for byte.
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    req.rawBody = body as string;
    if (!body) return done(null, {});
    try {
      done(null, JSON.parse(body as string));
    } catch {
      done(Object.assign(new Error('invalid_json'), { statusCode: 400 }), undefined);
    }
  });

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError) return reply.status(400).send({ error: 'invalid_request', issues: err.issues });
    if (err instanceof LedgerError) {
      const status = err.code === 'idempotency_conflict' ? 409 : 422;
      return reply.status(status).send({ error: err.code, message: err.message });
    }
    if (err instanceof PasskeyError) {
      const status = err.code === 'passkey_exists' ? 409 : 401;
      return reply.status(status).send({ error: err.code });
    }
    if (err instanceof QuoteError) return reply.status(422).send({ error: 'quote_unavailable', message: err.message });
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 429) return reply.status(429).send({ error: 'too_many_requests' });
    if (status === 401) return reply.status(401).send({ error: 'unauthorized' });
    if (status && status >= 400 && status < 500) return reply.status(status).send({ error: 'bad_request' });
    app.log.error(err);
    return reply.status(500).send({ error: 'internal_error' });
  });

  const unauthorized = () => Object.assign(new Error('unauthorized'), { statusCode: 401 });

  const requireUser = async (req: FastifyRequest) => {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    let claims;
    try {
      claims = await tokens.verify(token);
    } catch {
      throw unauthorized();
    }
    // The session is checked on every request, so signing a device out takes effect immediately.
    const session = await repo.getSession(claims.sessionId);
    if (!session || session.userId !== claims.userId || session.revokedAt || new Date(session.expiresAt) <= new Date()) {
      throw unauthorized();
    }
    const user = await repo.getUser(claims.userId);
    if (!user) throw unauthorized();
    req.user = user;
    req.session = session;
  };

  const publicUser = (u: User) => ({
    id: u.id, email: u.email, fullName: u.fullName, handle: u.handle, kycStatus: u.kycStatus,
  });

  const deviceNameFrom = (req: FastifyRequest, explicit?: string) =>
    explicit ?? (req.headers['user-agent']?.slice(0, 60) || 'Unknown device');

  /** Starts a device session and returns the token pair for it. */
  const signIn = async (user: User, deviceName: string) => {
    const refresh = newRefreshToken();
    const session = await repo.createSession({ userId: user.id, deviceName, tokenHash: refresh.hash, expiresAt: refresh.expiresAt });
    return {
      user: publicUser(user),
      accessToken: await tokens.issue(user.id, session.id),
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      refreshToken: refresh.token,
      sessionId: session.id,
    };
  };

  app.get('/health', async () => ({ status: 'ok' }));

  // Stricter limits on sign-in endpoints to slow down guessing.
  const authLimit = { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } };

  // Accounts and sessions ------------------------------------------------------

  app.post('/v1/auth/register', authLimit, async (req, reply) => {
    const input = registerSchema.parse(req.body);
    const { deviceName } = deviceSchema.parse(req.body);
    if (await repo.findByEmail(input.email)) {
      return reply.status(409).send({ error: 'email_taken' });
    }
    let user: User;
    try {
      user = await repo.createUser({ email: input.email, fullName: input.fullName, passwordHash: await hashPassword(input.password) });
    } catch (err) {
      if ((err as Error).message === 'email_taken') return reply.status(409).send({ error: 'email_taken' });
      throw err;
    }
    await repo.record(user.id, 'user.registered');
    return reply.status(201).send(await signIn(user, deviceNameFrom(req, deviceName)));
  });

  app.post('/v1/auth/login', authLimit, async (req, reply) => {
    const input = loginSchema.parse(req.body);
    const { deviceName } = deviceSchema.parse(req.body);
    const user = await repo.findByEmail(input.email);
    // Same response and similar timing for unknown email and wrong password, so attackers can't find accounts.
    const ok = await verifyPassword(input.password, user?.passwordHash ?? (await DUMMY_HASH));
    if (!user || !user.passwordHash || !ok) {
      if (user) await repo.record(user.id, 'auth.login_failed', { ip: req.ip });
      return reply.status(401).send({ error: 'invalid_credentials' });
    }
    const result = await signIn(user, deviceNameFrom(req, deviceName));
    await repo.record(user.id, 'auth.login', { ip: req.ip, method: 'password', sessionId: result.sessionId });
    return result;
  });

  app.post('/v1/auth/refresh', authLimit, async (req, reply) => {
    const { refreshToken } = refreshSchema.parse(req.body);
    const next = newRefreshToken();
    const result = await repo.rotateRefreshToken(hashRefreshToken(refreshToken), next.hash, next.expiresAt);
    if (result.status === 'reused') {
      // A refresh token was used twice: someone may have copied it. End that session everywhere.
      await repo.record(result.session.userId, 'auth.refresh_token_reuse', { sessionId: result.session.id, ip: req.ip });
      return reply.status(401).send({ error: 'session_revoked' });
    }
    if (result.status === 'invalid') return reply.status(401).send({ error: 'invalid_refresh_token' });
    const user = await repo.getUser(result.session.userId);
    if (!user) return reply.status(401).send({ error: 'invalid_refresh_token' });
    return {
      accessToken: await tokens.issue(user.id, result.session.id),
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      refreshToken: next.token,
      sessionId: result.session.id,
    };
  });

  app.post('/v1/auth/logout', { preHandler: requireUser }, async (req, reply) => {
    await repo.revokeSession(req.user!.id, req.session!.id, 'logout');
    await repo.record(req.user!.id, 'auth.logout', { sessionId: req.session!.id });
    return reply.status(204).send();
  });

  app.get('/v1/me', { preHandler: requireUser }, async (req) => ({ user: publicUser(req.user!) }));

  app.get('/v1/sessions', { preHandler: requireUser }, async (req) => ({
    sessions: (await repo.listSessions(req.user!.id)).map((s) => ({
      id: s.id, deviceName: s.deviceName, createdAt: s.createdAt, lastUsedAt: s.lastUsedAt, current: s.id === req.session!.id,
    })),
  }));

  app.delete<{ Params: { id: string } }>('/v1/sessions/:id', { preHandler: requireUser }, async (req, reply) => {
    const ok = await repo.revokeSession(req.user!.id, req.params.id, 'signed_out_by_user');
    if (!ok) return reply.status(404).send({ error: 'not_found' });
    await repo.record(req.user!.id, 'auth.session_revoked', { sessionId: req.params.id });
    return reply.status(204).send();
  });

  // Passkeys -------------------------------------------------------------------

  app.post('/v1/passkeys/register/options', { preHandler: requireUser }, async (req) => passkeys.registrationOptions(req.user!));

  app.post('/v1/passkeys/register/verify', { preHandler: requireUser }, async (req, reply) => {
    const input = passkeyVerifySchema.parse(req.body);
    const id = await passkeys.verifyRegistration(req.user!, input.challengeId, input.response as never, input.nickname ?? 'Passkey');
    await repo.record(req.user!.id, 'passkey.added', { passkeyId: id });
    return reply.status(201).send({ passkeyId: id });
  });

  app.get('/v1/passkeys', { preHandler: requireUser }, async (req) => ({
    passkeys: (await repo.listPasskeys(req.user!.id)).map((p) => ({
      id: p.id, nickname: p.nickname, synced: p.backedUp, createdAt: p.createdAt, lastUsedAt: p.lastUsedAt,
    })),
  }));

  app.delete<{ Params: { id: string } }>('/v1/passkeys/:id', { preHandler: requireUser }, async (req, reply) => {
    const ok = await repo.deletePasskey(req.user!.id, req.params.id);
    if (!ok) return reply.status(404).send({ error: 'not_found' });
    await repo.record(req.user!.id, 'passkey.removed', { passkeyId: req.params.id });
    return reply.status(204).send();
  });

  app.post('/v1/auth/passkey/options', authLimit, async () => passkeys.authenticationOptions());

  app.post('/v1/auth/passkey/verify', authLimit, async (req) => {
    const input = passkeyVerifySchema.parse(req.body);
    const user = await passkeys.verifyAuthentication(input.challengeId, input.response as never);
    const result = await signIn(user, deviceNameFrom(req, input.deviceName));
    await repo.record(user.id, 'auth.login', { ip: req.ip, method: 'passkey', sessionId: result.sessionId });
    return result;
  });

  // Identity verification (KYC) ----------------------------------------------------

  app.post('/v1/kyc/sessions', { preHandler: requireUser }, async (req, reply) => {
    const user = req.user!;
    if (user.kycStatus === 'verified') return reply.status(409).send({ error: 'already_verified' });
    const started = await kyc.start({ userId: user.id, email: user.email, fullName: user.fullName });
    const check = await repo.createKycCheck({ userId: user.id, provider: kyc.name, providerRef: started.providerRef });
    await repo.record(user.id, 'kyc.started', { checkId: check.id, provider: kyc.name });
    return reply.status(201).send({ checkId: check.id, status: check.status, verificationUrl: started.verificationUrl, sandbox: kyc.name === 'sandbox' });
  });

  app.get('/v1/kyc/status', { preHandler: requireUser }, async (req) => {
    const check = await repo.latestKycCheck(req.user!.id);
    return {
      kycStatus: req.user!.kycStatus,
      sandbox: kyc.name === 'sandbox' && config.NODE_ENV !== 'production',
      latestCheck: check ? { id: check.id, status: check.status, reason: check.reason, createdAt: check.createdAt } : null,
    };
  });

  // Called by the verification vendor. Only accepted with a valid, fresh signature.
  app.post('/v1/kyc/webhook', async (req, reply) => {
    const signature = req.headers['x-oenodpay-signature'];
    if (!verifyWebhook(config.kycWebhookSecret, req.rawBody ?? '', typeof signature === 'string' ? signature : undefined)) {
      app.log.warn('Rejected KYC webhook with a bad signature');
      return reply.status(401).send({ error: 'bad_signature' });
    }
    const event = kycWebhookSchema.parse(req.body);
    const check = await repo.completeKycCheck(event.providerRef, event.decision, event.reason ?? null);
    if (!check) return reply.status(404).send({ error: 'unknown_check' });
    await repo.record(check.userId, `kyc.${check.status}`, { checkId: check.id });
    return { received: true, status: check.status };
  });

  if (kyc.name === 'sandbox' && config.NODE_ENV !== 'production') {
    // Development only: plays the vendor's part and sends a correctly signed webhook.
    app.post('/v1/kyc/sandbox/decide', { preHandler: requireUser }, async (req, reply) => {
      const { decision } = z.object({ decision: z.enum(['verified', 'rejected']) }).parse(req.body);
      const check = await repo.latestKycCheck(req.user!.id);
      if (!check || check.status !== 'started') return reply.status(409).send({ error: 'no_open_check' });
      const body = JSON.stringify({ providerRef: check.providerRef, decision, reason: decision === 'rejected' ? 'sandbox_rejection' : null });
      const res = await app.inject({
        method: 'POST', url: '/v1/kyc/webhook', payload: body,
        headers: { 'content-type': 'application/json', 'x-oenodpay-signature': signWebhook(config.kycWebhookSecret, body) },
      });
      return reply.status(res.statusCode).send(res.json());
    });
  }

  // Money ----------------------------------------------------------------------

  app.get('/v1/wallet', { preHandler: requireUser }, async (req) => {
    const user = req.user!;
    return {
      currency: 'CAD',
      balanceMinor: await repo.balance(user.walletAccountId),
      activity: await repo.history(user.walletAccountId, 50),
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
    const recipient = await repo.findByHandle(input.toHandle);
    if (!recipient || recipient.id === user.id) {
      return reply.status(404).send({ error: 'recipient_not_found' });
    }
    const entry = await repo.post(`${user.id}:${idempotencyKey}`, `Transfer to @${recipient.handle}`, [
      { accountId: user.walletAccountId, amountMinor: -input.amountMinor },
      { accountId: recipient.walletAccountId, amountMinor: input.amountMinor },
    ]);
    await repo.record(user.id, 'transfer.wallet', { entryId: entry.id, to: recipient.id, amountMinor: input.amountMinor });
    return reply.status(201).send({ transferId: entry.id, balanceMinor: await repo.balance(user.walletAccountId) });
  });

  // Early access. The answer is the same whether or not the email was already listed,
  // so the form can't be used to check who has signed up.
  app.post('/v1/waitlist', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, async (req, reply) => {
    const input = waitlistSchema.parse(req.body);
    const added = await repo.joinWaitlist(input.email, input.source ?? null);
    if (added) await repo.record(null, 'waitlist.joined', { source: input.source ?? null });
    return reply.status(202).send({ status: 'listed' });
  });

  app.get('/v1/corridors', async () => ({ corridors: CORRIDORS, sampleData: true }));

  app.post('/v1/quotes', { preHandler: requireUser }, async (req) => {
    const input = quoteSchema.parse(req.body);
    return { quote: quoteTransfer(input.countryCode, input.methodId, input.amountMinor), sampleData: true };
  });

  return app;
}
