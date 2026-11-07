import { createHash, generateKeyPairSync, randomBytes, sign } from 'node:crypto';
import { isoCBOR } from '@simplewebauthn/server/helpers';

const b64url = (b: Uint8Array) => Buffer.from(b).toString('base64url');
const sha256 = (b: Uint8Array | string) => createHash('sha256').update(b).digest();

/**
 * A software passkey (ES256), used only in tests to run the full WebAuthn ceremonies
 * against the real verifier: same bytes a phone or laptop would send.
 */
export class SoftAuthenticator {
  private keys = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  readonly credentialId = randomBytes(16);
  private counter = 0;

  constructor(private rpId: string, private origin: string) {}

  get id(): string {
    return b64url(this.credentialId);
  }

  private cosePublicKey(): Uint8Array {
    const jwk = this.keys.publicKey.export({ format: 'jwk' });
    // kty: EC2 (2), alg: ES256 (-7), crv: P-256 (1), x, y
    return isoCBOR.encode(new Map<number, number | Uint8Array>([
      [1, 2], [3, -7], [-1, 1],
      [-2, new Uint8Array(Buffer.from(jwk.x!, 'base64url'))],
      [-3, new Uint8Array(Buffer.from(jwk.y!, 'base64url'))],
    ]));
  }

  private authData(flags: number, attested?: Uint8Array): Buffer {
    const counter = Buffer.alloc(4);
    counter.writeUInt32BE(this.counter);
    return Buffer.concat([sha256(this.rpId), Buffer.from([flags]), counter, ...(attested ? [attested] : [])]);
  }

  private clientData(type: string, challenge: string, origin = this.origin): Buffer {
    return Buffer.from(JSON.stringify({ type, challenge, origin, crossOrigin: false }));
  }

  /** Answers navigator.credentials.create(). userVerified=false simulates a device without Face ID / PIN. */
  register(challenge: string, opts: { userVerified?: boolean; origin?: string } = {}) {
    const idLen = Buffer.alloc(2);
    idLen.writeUInt16BE(this.credentialId.length);
    const attested = Buffer.concat([Buffer.alloc(16), idLen, this.credentialId, this.cosePublicKey()]);
    // Flags: user present (0x01), user verified (0x04), attested credential data (0x40)
    const flags = 0x01 | (opts.userVerified === false ? 0 : 0x04) | 0x40;
    const attestationObject = isoCBOR.encode(new Map<string, unknown>([
      ['fmt', 'none'], ['attStmt', new Map()], ['authData', new Uint8Array(this.authData(flags, attested))],
    ]) as never);
    return {
      id: this.id, rawId: this.id, type: 'public-key', clientExtensionResults: {}, authenticatorAttachment: 'platform',
      response: {
        clientDataJSON: b64url(this.clientData('webauthn.create', challenge, opts.origin)),
        attestationObject: b64url(attestationObject),
        transports: ['internal'],
      },
    };
  }

  /** Answers navigator.credentials.get(). */
  authenticate(challenge: string, opts: { origin?: string; replayCounter?: boolean } = {}) {
    if (!opts.replayCounter) this.counter += 1;
    const authenticatorData = this.authData(0x01 | 0x04);
    const clientDataJSON = this.clientData('webauthn.get', challenge, opts.origin);
    const signature = sign('sha256', Buffer.concat([authenticatorData, sha256(clientDataJSON)]), this.keys.privateKey);
    return {
      id: this.id, rawId: this.id, type: 'public-key', clientExtensionResults: {}, authenticatorAttachment: 'platform',
      response: {
        clientDataJSON: b64url(clientDataJSON),
        authenticatorData: b64url(authenticatorData),
        signature: b64url(signature),
      },
    };
  }
}
