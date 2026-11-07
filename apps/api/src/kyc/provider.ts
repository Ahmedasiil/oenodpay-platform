import { randomUUID } from 'node:crypto';

/**
 * Identity verification vendor (ID document + selfie + liveness). The vendor holds the images;
 * we keep only its reference and the decision. Swap the sandbox for a real vendor
 * (for example Persona, Onfido, Veriff or Trulioo) by adding a class with this shape.
 */
export interface KycProvider {
  readonly name: string;
  /** Starts a verification and returns where the person completes it. */
  start(input: { userId: string; email: string; fullName: string }): Promise<{ providerRef: string; verificationUrl: string }>;
}

export class SandboxKycProvider implements KycProvider {
  readonly name = 'sandbox';
  async start(): Promise<{ providerRef: string; verificationUrl: string }> {
    const providerRef = `sbx_${randomUUID()}`;
    return { providerRef, verificationUrl: `oenodpay://kyc/sandbox/${providerRef}` };
  }
}
