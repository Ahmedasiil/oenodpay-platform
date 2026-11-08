import { describe, expect, it } from 'vitest';
import { buildApp } from './app';
import { loadConfig } from './config';
import { signWebhook } from './kyc/webhook';
import { freshRepo, repoKinds } from './test/repos';
import { SoftAuthenticator } from './test/soft-authenticator';
import type { Repository } from './repo/types';

const ORIGIN = 'http://localhost:3000';
const config = loadConfig({
  NODE_ENV: 'test', JWT_SECRET: 'x'.repeat(48), KYC_WEBHOOK_SECRET: 'w'.repeat(48),
} as NodeJS.ProcessEnv);

type App = Awaited<ReturnType<typeof buildApp>>;
interface Tokens { user: { id: string; handle: string }; accessToken: string; refreshToken: string; sessionId: string }

async function signUp(app: App, email: string): Promise<Tokens> {
  const res = await app.inject({
    method: 'POST', url: '/v1/auth/register',
    payload: { email, password: 'correct horse battery', fullName: 'Test User', deviceName: 'Test phone' },
  });
  expect(res.statusCode).toBe(201);
  return res.json();
}

const auth = (t: { accessToken: string }) => ({ authorization: `Bearer ${t.accessToken}` });

async function verify(app: App, t: Tokens) {
  expect((await app.inject({ method: 'POST', url: '/v1/kyc/sessions', headers: auth(t) })).statusCode).toBe(201);
  const res = await app.inject({ method: 'POST', url: '/v1/kyc/sandbox/decide', headers: auth(t), payload: { decision: 'verified' } });
  expect(res.statusCode).toBe(200);
}

describe.each(repoKinds)('API (%s)', (kind) => {
  let repo: Repository;
  const setup = async () => {
    repo = await freshRepo(kind);
    return buildApp(config, repo);
  };

  it('registers, logs in and answers wrong passwords exactly like unknown emails', async () => {
    const app = await setup();
    await signUp(app, 'ahmed@example.com');
    const ok = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'ahmed@example.com', password: 'correct horse battery' } });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().refreshToken).toBeTypeOf('string');
    const wrong = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'ahmed@example.com', password: 'nope' } });
    const unknown = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'ghost@example.com', password: 'nope' } });
    expect(wrong.statusCode).toBe(401);
    expect(unknown.json()).toEqual(wrong.json());
    const dup = await app.inject({ method: 'POST', url: '/v1/auth/register', payload: { email: 'AHMED@example.com', password: 'correct horse battery', fullName: 'Xavier Test' } });
    expect(dup.statusCode).toBe(409);
  });

  it('adds emails to the early-access list once and answers the same for repeats', async () => {
    const app = await setup();
    const first = await app.inject({ method: 'POST', url: '/v1/waitlist', payload: { email: 'Early@Example.com', source: 'website' } });
    const again = await app.inject({ method: 'POST', url: '/v1/waitlist', payload: { email: 'early@example.com' } });
    expect(first.statusCode).toBe(202);
    expect(again.statusCode).toBe(202);
    expect(again.json()).toEqual(first.json());
    expect(await repo.waitlistCount()).toBe(1);
    const bad = await app.inject({ method: 'POST', url: '/v1/waitlist', payload: { email: 'not-an-email' } });
    expect(bad.statusCode).toBe(400);
    await app.close();
  });

  it('blocks protected routes without a valid token', async () => {
    const app = await setup();
    const res = await app.inject({ method: 'GET', url: '/v1/wallet', headers: { authorization: 'Bearer forged' } });
    expect(res.statusCode).toBe(401);
  });

  it('rotates refresh tokens and shuts the session down if an old one is replayed', async () => {
    const app = await setup();
    const t = await signUp(app, 'rot@example.com');
    const r1 = await app.inject({ method: 'POST', url: '/v1/auth/refresh', payload: { refreshToken: t.refreshToken } });
    expect(r1.statusCode).toBe(200);
    const next = r1.json();
    expect(next.refreshToken).not.toBe(t.refreshToken);
    expect((await app.inject({ method: 'GET', url: '/v1/me', headers: auth(next) })).statusCode).toBe(200);

    // An attacker replays the first (already used) refresh token.
    const replay = await app.inject({ method: 'POST', url: '/v1/auth/refresh', payload: { refreshToken: t.refreshToken } });
    expect(replay.statusCode).toBe(401);
    expect(replay.json().error).toBe('session_revoked');
    // The real device is signed out too, and its access token stops working at once.
    expect((await app.inject({ method: 'GET', url: '/v1/me', headers: auth(next) })).statusCode).toBe(401);
    expect((await app.inject({ method: 'POST', url: '/v1/auth/refresh', payload: { refreshToken: next.refreshToken } })).statusCode).toBe(401);
    expect((await repo.auditFor(t.user.id)).map((e) => e.action)).toContain('auth.refresh_token_reuse');
  });

  it('lists devices and signs one out remotely', async () => {
    const app = await setup();
    const phone = await signUp(app, 'dev@example.com');
    const laptopRes = await app.inject({
      method: 'POST', url: '/v1/auth/login',
      payload: { email: 'dev@example.com', password: 'correct horse battery', deviceName: 'Laptop' },
    });
    const laptop = laptopRes.json();
    const list = await app.inject({ method: 'GET', url: '/v1/sessions', headers: auth(phone) });
    expect(list.json().sessions).toHaveLength(2);
    expect(list.json().sessions.find((s: { current: boolean }) => s.current).deviceName).toBe('Test phone');
    const del = await app.inject({ method: 'DELETE', url: `/v1/sessions/${laptop.sessionId}`, headers: auth(phone) });
    expect(del.statusCode).toBe(204);
    expect((await app.inject({ method: 'GET', url: '/v1/me', headers: auth(laptop) })).statusCode).toBe(401);
    expect((await app.inject({ method: 'POST', url: '/v1/auth/logout', headers: auth(phone) })).statusCode).toBe(204);
    expect((await app.inject({ method: 'GET', url: '/v1/me', headers: auth(phone) })).statusCode).toBe(401);
  });

  it('adds a passkey and signs in with it, with no password', async () => {
    const app = await setup();
    const t = await signUp(app, 'pk@example.com');
    const device = new SoftAuthenticator('localhost', ORIGIN);

    const regOpts = (await app.inject({ method: 'POST', url: '/v1/passkeys/register/options', headers: auth(t) })).json();
    expect(regOpts.options.authenticatorSelection.userVerification).toBe('required');
    const reg = await app.inject({
      method: 'POST', url: '/v1/passkeys/register/verify', headers: auth(t),
      payload: { challengeId: regOpts.challengeId, response: device.register(regOpts.options.challenge), nickname: 'My iPhone' },
    });
    expect(reg.statusCode).toBe(201);
    expect((await app.inject({ method: 'GET', url: '/v1/passkeys', headers: auth(t) })).json().passkeys[0].nickname).toBe('My iPhone');

    const loginOpts = (await app.inject({ method: 'POST', url: '/v1/auth/passkey/options' })).json();
    const login = await app.inject({
      method: 'POST', url: '/v1/auth/passkey/verify',
      payload: { challengeId: loginOpts.challengeId, response: device.authenticate(loginOpts.options.challenge) },
    });
    expect(login.statusCode).toBe(200);
    expect(login.json().user.id).toBe(t.user.id);

    // The same challenge can't be used twice.
    const reuse = await app.inject({
      method: 'POST', url: '/v1/auth/passkey/verify',
      payload: { challengeId: loginOpts.challengeId, response: device.authenticate(loginOpts.options.challenge) },
    });
    expect(reuse.statusCode).toBe(401);
  });

  it('refuses passkeys from the wrong website, without Face ID or PIN, or from a cloned device', async () => {
    const app = await setup();
    const t = await signUp(app, 'pk2@example.com');
    const device = new SoftAuthenticator('localhost', ORIGIN);
    const opts = async () => (await app.inject({ method: 'POST', url: '/v1/passkeys/register/options', headers: auth(t) })).json();

    let o = await opts();
    const phishing = await app.inject({
      method: 'POST', url: '/v1/passkeys/register/verify', headers: auth(t),
      payload: { challengeId: o.challengeId, response: device.register(o.options.challenge, { origin: 'https://oenodpay-login.evil' }) },
    });
    expect(phishing.statusCode).toBe(401);

    o = await opts();
    const noUv = await app.inject({
      method: 'POST', url: '/v1/passkeys/register/verify', headers: auth(t),
      payload: { challengeId: o.challengeId, response: device.register(o.options.challenge, { userVerified: false }) },
    });
    expect(noUv.statusCode).toBe(401);

    o = await opts();
    await app.inject({
      method: 'POST', url: '/v1/passkeys/register/verify', headers: auth(t),
      payload: { challengeId: o.challengeId, response: device.register(o.options.challenge) },
    });
    const first = (await app.inject({ method: 'POST', url: '/v1/auth/passkey/options' })).json();
    expect((await app.inject({
      method: 'POST', url: '/v1/auth/passkey/verify',
      payload: { challengeId: first.challengeId, response: device.authenticate(first.options.challenge) },
    })).statusCode).toBe(200);
    // A copy of the key would send an old signature counter.
    const second = (await app.inject({ method: 'POST', url: '/v1/auth/passkey/options' })).json();
    expect((await app.inject({
      method: 'POST', url: '/v1/auth/passkey/verify',
      payload: { challengeId: second.challengeId, response: device.authenticate(second.options.challenge, { replayCounter: true }) },
    })).statusCode).toBe(401);
  });

  it('verifies identity through a signed webhook and only then allows sending', async () => {
    const app = await setup();
    const a = await signUp(app, 'c@example.com');
    const b = await signUp(app, 'd@example.com');
    const send = (key: string) => app.inject({
      method: 'POST', url: '/v1/transfers/wallet',
      headers: { ...auth(a), 'idempotency-key': key },
      payload: { toHandle: b.user.handle, amountMinor: 100 },
    });
    expect((await send('k-000001')).statusCode).toBe(403);

    const started = await app.inject({ method: 'POST', url: '/v1/kyc/sessions', headers: auth(a) });
    expect(started.json().sandbox).toBe(true);
    expect((await app.inject({ method: 'GET', url: '/v1/kyc/status', headers: auth(a) })).json().latestCheck.status).toBe('started');

    // A forged or stale webhook is refused.
    const check = await repo.latestKycCheck(a.user.id);
    const body = JSON.stringify({ providerRef: check!.providerRef, decision: 'verified' });
    const forged = await app.inject({
      method: 'POST', url: '/v1/kyc/webhook', payload: body,
      headers: { 'content-type': 'application/json', 'x-oenodpay-signature': signWebhook('wrong-secret'.repeat(4), body) },
    });
    expect(forged.statusCode).toBe(401);
    const stale = await app.inject({
      method: 'POST', url: '/v1/kyc/webhook', payload: body,
      headers: { 'content-type': 'application/json', 'x-oenodpay-signature': signWebhook(config.kycWebhookSecret, body, Math.floor(Date.now() / 1000) - 3600) },
    });
    expect(stale.statusCode).toBe(401);

    const real = await app.inject({
      method: 'POST', url: '/v1/kyc/webhook', payload: body,
      headers: { 'content-type': 'application/json', 'x-oenodpay-signature': signWebhook(config.kycWebhookSecret, body) },
    });
    expect(real.statusCode).toBe(200);
    expect((await app.inject({ method: 'GET', url: '/v1/me', headers: auth(a) })).json().user.kycStatus).toBe('verified');
    // Money is required too: the wallet is empty, so the ledger refuses.
    expect((await send('k-000002')).json().error).toBe('insufficient_funds');
  });

  it('sends money between verified wallets once per idempotency key', async () => {
    const app = await setup();
    const a = await signUp(app, 'a@example.com');
    const b = await signUp(app, 'b@example.com');
    await verify(app, a);
    const sender = (await repo.getUser(a.user.id))!;
    await repo.post('seed', 'Top-up', [
      { accountId: repo.system.funding, amountMinor: -10_000 },
      { accountId: sender.walletAccountId, amountMinor: 10_000 },
    ]);
    const send = (amountMinor: number) => app.inject({
      method: 'POST', url: '/v1/transfers/wallet',
      headers: { ...auth(a), 'idempotency-key': 'abc12345' },
      payload: { toHandle: `@${b.user.handle}`, amountMinor },
    });
    expect((await send(2_500)).statusCode).toBe(201);
    expect((await send(2_500)).statusCode).toBe(201);
    expect((await send(9_000)).statusCode).toBe(409);
    const wallet = await app.inject({ method: 'GET', url: '/v1/wallet', headers: auth(b) });
    expect(wallet.json().balanceMinor).toBe(2_500);
    expect(wallet.json().activity[0].description).toBe(`Transfer to @${b.user.handle}`);
  });

  it('quotes international transfers', async () => {
    const app = await setup();
    const a = await signUp(app, 'e@example.com');
    const res = await app.inject({
      method: 'POST', url: '/v1/quotes', headers: auth(a),
      payload: { countryCode: 'PH', methodId: 'ph-wallet', amountMinor: 50_000 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().quote.receive.currency).toBe('PHP');
  });
});

describe('Config', () => {
  it('refuses unsafe production settings', () => {
    expect(() => loadConfig({ NODE_ENV: 'production', JWT_SECRET: 'x'.repeat(48) } as NodeJS.ProcessEnv)).toThrow(/DATABASE_URL/);
  });
});
