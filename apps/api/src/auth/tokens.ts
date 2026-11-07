import { createHash, randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Short-lived access tokens (15 minutes), each tied to one device session (`sid`).
 * Ending a session cuts off its access token on the very next request.
 */
export class TokenService {
  private key: Uint8Array;
  constructor(secret: string) {
    this.key = new TextEncoder().encode(secret);
  }

  async issue(userId: string, sessionId: string): Promise<string> {
    return new SignJWT({ sid: sessionId })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuer('oenodpay')
      .setAudience('oenodpay-apps')
      .setIssuedAt()
      .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
      .sign(this.key);
  }

  async verify(token: string): Promise<{ userId: string; sessionId: string }> {
    const { payload } = await jwtVerify(token, this.key, { issuer: 'oenodpay', audience: 'oenodpay-apps', algorithms: ['HS256'] });
    if (!payload.sub || typeof payload.sid !== 'string') throw new Error('Token is missing claims');
    return { userId: payload.sub, sessionId: payload.sid };
  }
}

/** Refresh tokens are 256-bit random values. The server keeps only their SHA-256 hash. */
export function newRefreshToken(): { token: string; hash: Buffer; expiresAt: Date } {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashRefreshToken(token), expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS) };
}

export function hashRefreshToken(token: string): Buffer {
  return createHash('sha256').update(token).digest();
}
