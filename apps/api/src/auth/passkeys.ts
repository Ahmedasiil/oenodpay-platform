import {
  generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse,
  type AuthenticationResponseJSON, type AuthenticatorTransport, type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import type { Config } from '../config';
import type { Repository, User } from '../repo/types';

const CHALLENGE_TTL_MS = 5 * 60 * 1000;

export class PasskeyError extends Error {
  constructor(public code: 'challenge_expired' | 'verification_failed' | 'unknown_passkey' | 'passkey_exists') {
    super(code);
  }
}

/**
 * Passkeys (WebAuthn): sign in with Face ID, Touch ID, a fingerprint or Windows Hello.
 * The private key never leaves the person's device, so there is nothing to phish or leak.
 * Every ceremony uses a one-time server challenge that expires in five minutes,
 * and we require user verification (biometric or device PIN) every time.
 */
export class PasskeyService {
  constructor(private repo: Repository, private config: Config) {}

  async registrationOptions(user: User) {
    const existing = await this.repo.listPasskeys(user.id);
    const options = await generateRegistrationOptions({
      rpName: this.config.WEBAUTHN_RP_NAME,
      rpID: this.config.WEBAUTHN_RP_ID,
      userName: user.email,
      userDisplayName: user.fullName,
      userID: new TextEncoder().encode(user.id),
      attestationType: 'none',
      excludeCredentials: existing.map((p) => ({ id: p.id, transports: p.transports as AuthenticatorTransport[] })),
      authenticatorSelection: { residentKey: 'required', userVerification: 'required' },
    });
    const challengeId = await this.repo.saveChallenge({
      purpose: 'passkey_register', userId: user.id, challenge: options.challenge, expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
    });
    return { challengeId, options };
  }

  async verifyRegistration(user: User, challengeId: string, response: RegistrationResponseJSON, nickname: string) {
    const stored = await this.repo.takeChallenge(challengeId, 'passkey_register');
    if (!stored || stored.userId !== user.id) throw new PasskeyError('challenge_expired');
    let result;
    try {
      result = await verifyRegistrationResponse({
        response,
        expectedChallenge: stored.challenge,
        expectedOrigin: this.config.webauthnOrigins,
        expectedRPID: this.config.WEBAUTHN_RP_ID,
        requireUserVerification: true,
      });
    } catch {
      throw new PasskeyError('verification_failed');
    }
    if (!result.verified) throw new PasskeyError('verification_failed');
    const { credential, credentialDeviceType, credentialBackedUp } = result.registrationInfo;
    try {
      await this.repo.addPasskey({
        id: credential.id, userId: user.id, publicKey: credential.publicKey, counter: credential.counter,
        transports: credential.transports ?? [], deviceType: credentialDeviceType, backedUp: credentialBackedUp, nickname,
      });
    } catch (err) {
      if ((err as Error).message === 'passkey_exists') throw new PasskeyError('passkey_exists');
      throw err;
    }
    return credential.id;
  }

  /** Discoverable sign-in: the device offers the person's passkeys, no email needed. */
  async authenticationOptions() {
    const options = await generateAuthenticationOptions({ rpID: this.config.WEBAUTHN_RP_ID, userVerification: 'required' });
    const challengeId = await this.repo.saveChallenge({
      purpose: 'passkey_login', userId: null, challenge: options.challenge, expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
    });
    return { challengeId, options };
  }

  async verifyAuthentication(challengeId: string, response: AuthenticationResponseJSON): Promise<User> {
    const stored = await this.repo.takeChallenge(challengeId, 'passkey_login');
    if (!stored) throw new PasskeyError('challenge_expired');
    const passkey = await this.repo.getPasskey(response.id);
    if (!passkey) throw new PasskeyError('unknown_passkey');
    let result;
    try {
      result = await verifyAuthenticationResponse({
        response,
        expectedChallenge: stored.challenge,
        expectedOrigin: this.config.webauthnOrigins,
        expectedRPID: this.config.WEBAUTHN_RP_ID,
        credential: {
          id: passkey.id, publicKey: new Uint8Array(passkey.publicKey), counter: passkey.counter,
          transports: passkey.transports as AuthenticatorTransport[],
        },
        requireUserVerification: true,
      });
    } catch {
      throw new PasskeyError('verification_failed');
    }
    if (!result.verified) throw new PasskeyError('verification_failed');
    await this.repo.markPasskeyUsed(passkey.id, result.authenticationInfo.newCounter);
    const user = await this.repo.getUser(passkey.userId);
    if (!user) throw new PasskeyError('unknown_passkey');
    return user;
  }
}
