import { describe, expect, it } from 'vitest';
import { buildApp } from './app';
import { loadConfig } from './config';
import { Store } from './store';

const config = loadConfig({ NODE_ENV: 'test', JWT_SECRET: 'x'.repeat(48) } as NodeJS.ProcessEnv);

async function signUp(app: Awaited<ReturnType<typeof buildApp>>, email: string) {
  const res = await app.inject({ method: 'POST', url: '/v1/auth/register', payload: { email, password: 'correct horse battery', fullName: 'Test User' } });
  expect(res.statusCode).toBe(201);
  return res.json() as { user: { id: string; handle: string }; accessToken: string };
}

describe('API', () => {
  it('registers, logs in and rejects wrong passwords the same way as unknown emails', async () => {
    const app = await buildApp(config);
    await signUp(app, 'ahmed@example.com');
    const ok = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'ahmed@example.com', password: 'correct horse battery' } });
    expect(ok.statusCode).toBe(200);
    const wrong = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'ahmed@example.com', password: 'nope' } });
    const unknown = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: 'ghost@example.com', password: 'nope' } });
    expect(wrong.statusCode).toBe(401);
    expect(unknown.json()).toEqual(wrong.json());
  });

  it('blocks protected routes without a valid token', async () => {
    const app = await buildApp(config);
    const res = await app.inject({ method: 'GET', url: '/v1/wallet', headers: { authorization: 'Bearer forged' } });
    expect(res.statusCode).toBe(401);
  });

  it('sends money between verified wallets once per idempotency key', async () => {
    const store = new Store();
    const app = await buildApp(config, store);
    const a = await signUp(app, 'a@example.com');
    const b = await signUp(app, 'b@example.com');
    const sender = store.getUser(a.user.id)!;
    sender.kycStatus = 'verified';
    store.ledger.post('seed', 'Top-up', [
      { accountId: store.funding.id, amountMinor: -10_000 },
      { accountId: sender.walletAccountId, amountMinor: 10_000 },
    ]);
    const send = () => app.inject({
      method: 'POST', url: '/v1/transfers/wallet',
      headers: { authorization: `Bearer ${a.accessToken}`, 'idempotency-key': 'abc12345' },
      payload: { toHandle: `@${b.user.handle}`, amountMinor: 2_500 },
    });
    expect((await send()).statusCode).toBe(201);
    expect((await send()).statusCode).toBe(201);
    const wallet = await app.inject({ method: 'GET', url: '/v1/wallet', headers: { authorization: `Bearer ${b.accessToken}` } });
    expect(wallet.json().balanceMinor).toBe(2_500);
  });

  it('requires identity verification before money can leave', async () => {
    const app = await buildApp(config);
    const a = await signUp(app, 'c@example.com');
    const b = await signUp(app, 'd@example.com');
    const res = await app.inject({
      method: 'POST', url: '/v1/transfers/wallet',
      headers: { authorization: `Bearer ${a.accessToken}`, 'idempotency-key': 'k-000001' },
      payload: { toHandle: b.user.handle, amountMinor: 100 },
    });
    expect(res.statusCode).toBe(403);
  });

  it('quotes international transfers', async () => {
    const app = await buildApp(config);
    const a = await signUp(app, 'e@example.com');
    const res = await app.inject({
      method: 'POST', url: '/v1/quotes', headers: { authorization: `Bearer ${a.accessToken}` },
      payload: { countryCode: 'PH', methodId: 'ph-wallet', amountMinor: 50_000 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().quote.receive.currency).toBe('PHP');
  });
});
