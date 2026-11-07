import Constants from 'expo-constants';
import * as Device from 'expo-device';

import { secureDelete, secureGet, secureSet } from './secure-storage';

/**
 * Talks to the one oenodPay backend that the iOS app, Android app and website all share.
 * The access token (15 minutes) is kept in memory only. The refresh token is kept in the
 * device keychain and swapped for a new one every time it is used.
 */
const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:4000';

const REFRESH_KEY = 'oenodpay.refresh';
let accessToken: string | null = null;
let refreshing: Promise<boolean> | null = null;

export class ApiError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}

export interface SignedIn {
  user: { id: string; email: string; fullName: string; handle: string; kycStatus: 'pending' | 'verified' | 'rejected' };
  accessToken: string;
  refreshToken: string;
}

export const deviceName = () => [Device.manufacturer, Device.modelName].filter(Boolean).join(' ') || 'Mobile app';

export async function saveSession(s: { accessToken: string; refreshToken: string }) {
  accessToken = s.accessToken;
  await secureSet(REFRESH_KEY, s.refreshToken);
}

export async function clearSession() {
  accessToken = null;
  await secureDelete(REFRESH_KEY);
}

export async function hasSession(): Promise<boolean> {
  return accessToken !== null || (await secureGet(REFRESH_KEY)) !== null;
}

/** Swaps the stored refresh token for a new pair. Only one refresh runs at a time. */
async function refresh(): Promise<boolean> {
  refreshing ??= (async () => {
    const token = await secureGet(REFRESH_KEY);
    if (!token) return false;
    const res = await fetch(`${API_URL}/v1/auth/refresh`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refreshToken: token }),
    });
    if (!res.ok) {
      await clearSession();
      return false;
    }
    await saveSession(await res.json());
    return true;
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

export async function api<T>(path: string, init: { method?: string; body?: unknown; idempotencyKey?: string } = {}, retry = true): Promise<T> {
  if (!accessToken && retry && (await secureGet(REFRESH_KEY))) await refresh();
  const headers: Record<string, string> = {};
  if (init.body !== undefined) headers['content-type'] = 'application/json';
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;
  if (init.idempotencyKey) headers['idempotency-key'] = init.idempotencyKey;
  const res = await fetch(`${API_URL}${path}`, {
    method: init.method ?? 'GET',
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (res.status === 401 && retry && (await refresh())) return api<T>(path, init, false);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(res.status, body.error ?? 'request_failed');
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

/** A fresh key per user action, so a retried tap never sends money twice. */
export function newIdempotencyKey(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
