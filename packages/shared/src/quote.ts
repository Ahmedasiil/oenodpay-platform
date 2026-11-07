import type { Corridor } from './corridors';
import { findCorridor } from './corridors';
import { money, type Money } from './money';

export interface Quote {
  countryCode: string;
  methodId: string;
  send: Money;
  fee: Money;
  rate: number;
  receive: Money;
  eta: string;
}

export class QuoteError extends Error {}

/** Calculates what the recipient gets. Pure function, shared by apps and API. */
export function quoteTransfer(countryCode: string, methodId: string, sendMinorCad: number): Quote {
  const corridor: Corridor | undefined = findCorridor(countryCode);
  if (!corridor) throw new QuoteError(`We don't send to ${countryCode} yet`);
  const method = corridor.methods.find((m) => m.id === methodId);
  if (!method) throw new QuoteError('That payout method is not available in this country');
  if (!Number.isSafeInteger(sendMinorCad) || sendMinorCad <= method.feeMinor) {
    throw new QuoteError('Amount must be more than the fee');
  }
  const netMinor = sendMinorCad - method.feeMinor;
  // Both currencies use 2 minor units today; convert minor to minor directly.
  const receiveMinor = Math.floor(netMinor * corridor.sampleRate);
  return {
    countryCode: corridor.countryCode,
    methodId: method.id,
    send: money(sendMinorCad, 'CAD'),
    fee: money(method.feeMinor, 'CAD'),
    rate: corridor.sampleRate,
    receive: money(receiveMinor, corridor.currency),
    eta: method.eta,
  };
}
