import { randomBytes } from 'node:crypto';
import { z } from 'zod';

const list = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().default(4000),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:8081'),
  /** PostgreSQL connection. Without it the API keeps data in memory (development only). */
  DATABASE_URL: z.string().url().optional(),
  /** Passkeys are bound to this domain, e.g. oenodpay.com. */
  WEBAUTHN_RP_ID: z.string().default('localhost'),
  WEBAUTHN_RP_NAME: z.string().default('oenodPay'),
  /** Web and app origins allowed to complete a passkey ceremony. */
  WEBAUTHN_ORIGINS: z.string().default('http://localhost:3000,http://localhost:8081'),
  /** Identity verification vendor. 'sandbox' approves or rejects on request and is refused in production. */
  KYC_PROVIDER: z.enum(['sandbox']).default('sandbox'),
  /** Shared secret used to check the signature on the vendor's webhooks. */
  KYC_WEBHOOK_SECRET: z.string().min(32).optional(),
}).superRefine((env, ctx) => {
  if (env.NODE_ENV !== 'production') return;
  if (!env.DATABASE_URL) ctx.addIssue({ code: 'custom', path: ['DATABASE_URL'], message: 'DATABASE_URL is required in production' });
  if (!env.KYC_WEBHOOK_SECRET) ctx.addIssue({ code: 'custom', path: ['KYC_WEBHOOK_SECRET'], message: 'KYC_WEBHOOK_SECRET is required in production' });
  if (env.KYC_PROVIDER === 'sandbox') ctx.addIssue({ code: 'custom', path: ['KYC_PROVIDER'], message: 'The sandbox ID check cannot run in production' });
  if (env.WEBAUTHN_RP_ID === 'localhost') ctx.addIssue({ code: 'custom', path: ['WEBAUTHN_RP_ID'], message: 'Set WEBAUTHN_RP_ID to the real domain' });
});

export type Config = z.infer<typeof schema> & {
  corsOrigins: string[];
  webauthnOrigins: string[];
  kycWebhookSecret: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = schema.parse(env);
  return {
    ...parsed,
    corsOrigins: list(parsed.CORS_ORIGINS),
    webauthnOrigins: list(parsed.WEBAUTHN_ORIGINS),
    // Outside production a random secret is fine: the sandbox signs its own webhooks.
    kycWebhookSecret: parsed.KYC_WEBHOOK_SECRET ?? randomBytes(32).toString('hex'),
  };
}
