import { z } from 'zod';

/** Request bodies shared by the API (validation) and the apps (forms). */
export const MAX_TRANSFER_MINOR = 300_000; // $3,000 per transfer while trust is building

export const amountMinor = z.number().int().positive().max(MAX_TRANSFER_MINOR);

export const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(12, 'Use at least 12 characters').max(128),
  fullName: z.string().min(2).max(120),
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

export const walletTransferSchema = z.object({
  toHandle: z.string().min(2).max(64),
  amountMinor,
  note: z.string().max(140).optional(),
});

export const quoteSchema = z.object({
  countryCode: z.string().length(2),
  methodId: z.string().min(1).max(40),
  amountMinor,
});

/** Early-access sign-up from the website. */
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().max(40).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WalletTransferInput = z.infer<typeof walletTransferSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
