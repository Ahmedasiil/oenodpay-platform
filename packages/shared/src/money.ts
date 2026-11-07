/**
 * Money is always stored as an integer number of minor units (cents),
 * never as a floating point number, so balances can never drift.
 */
export type Currency = 'CAD' | 'USD' | 'PHP' | 'INR' | 'PKR' | 'NGN' | 'EGP' | 'MXN' | 'GBP';

export interface Money {
  /** Integer amount in minor units, e.g. 1050 = $10.50 */
  minor: number;
  currency: Currency;
}

export const MINOR_UNITS: Record<Currency, number> = {
  CAD: 2, USD: 2, PHP: 2, INR: 2, PKR: 2, NGN: 2, EGP: 2, MXN: 2, GBP: 2,
};

export function money(minor: number, currency: Currency): Money {
  if (!Number.isSafeInteger(minor)) {
    throw new Error('Money amounts must be whole minor units');
  }
  return { minor, currency };
}

export function fromMajor(major: number, currency: Currency): Money {
  const factor = 10 ** MINOR_UNITS[currency];
  return money(Math.round(major * factor), currency);
}

export function toMajor(m: Money): number {
  return m.minor / 10 ** MINOR_UNITS[m.currency];
}

export function formatMoney(m: Money, locale = 'en-CA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: m.currency,
    currencyDisplay: m.currency === 'CAD' ? 'narrowSymbol' : 'code',
  }).format(toMajor(m));
}
