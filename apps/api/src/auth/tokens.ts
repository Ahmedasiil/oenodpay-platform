import { SignJWT, jwtVerify } from 'jose';

/** Short-lived access tokens (15 minutes). Refresh tokens and device binding come next. */
export class TokenService {
  private key: Uint8Array;
  constructor(secret: string) {
    this.key = new TextEncoder().encode(secret);
  }

  async issue(userId: string): Promise<string> {
    return new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuer('oenodpay')
      .setAudience('oenodpay-apps')
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(this.key);
  }

  async verify(token: string): Promise<string> {
    const { payload } = await jwtVerify(token, this.key, { issuer: 'oenodpay', audience: 'oenodpay-apps', algorithms: ['HS256'] });
    if (!payload.sub) throw new Error('Token has no subject');
    return payload.sub;
  }
}
