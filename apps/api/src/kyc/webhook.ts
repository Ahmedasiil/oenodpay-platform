import { createHmac, timingSafeEqual } from 'node:crypto';

/** Webhooks older than this are refused, so a captured request can't be replayed later. */
export const WEBHOOK_TOLERANCE_SECONDS = 300;

/** Header format: `t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>">`. */
export function signWebhook(secret: string, rawBody: string, timestamp = Math.floor(Date.now() / 1000)): string {
  const mac = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  return `t=${timestamp},v1=${mac}`;
}

export function verifyWebhook(secret: string, rawBody: string, header: string | undefined, now = Math.floor(Date.now() / 1000)): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=', 2) as [string, string]));
  const t = Number(parts.t);
  const v1 = parts.v1 ?? '';
  if (!Number.isInteger(t) || Math.abs(now - t) > WEBHOOK_TOLERANCE_SECONDS || !/^[0-9a-f]{64}$/.test(v1)) return false;
  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest();
  return timingSafeEqual(expected, Buffer.from(v1, 'hex'));
}
