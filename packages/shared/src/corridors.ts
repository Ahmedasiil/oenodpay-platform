import type { Currency } from './money';

/**
 * Countries OenodPay can send to, and how money is received there.
 * In production this list comes from the payout partner's corridor API;
 * the rates and fees here are SAMPLE values for development only.
 */
export type PayoutMethodType = 'bank' | 'mobile_wallet' | 'cash_pickup';

export interface PayoutMethod {
  id: string;
  type: PayoutMethodType;
  name: string;
  eta: string;
  /** Fee in CAD minor units */
  feeMinor: number;
}

export interface Corridor {
  countryCode: string;
  countryName: string;
  currency: Currency;
  /** Sample rate: units of `currency` per 1 CAD */
  sampleRate: number;
  methods: PayoutMethod[];
}

export const CORRIDORS: Corridor[] = [
  {
    countryCode: 'PH', countryName: 'Philippines', currency: 'PHP', sampleRate: 41.5,
    methods: [
      { id: 'ph-wallet', type: 'mobile_wallet', name: 'Mobile wallet', eta: 'Within minutes', feeMinor: 299 },
      { id: 'ph-bank', type: 'bank', name: 'Bank deposit', eta: 'Within 1 hour', feeMinor: 399 },
      { id: 'ph-cash', type: 'cash_pickup', name: 'Cash pickup', eta: 'Within minutes', feeMinor: 499 },
    ],
  },
  {
    countryCode: 'IN', countryName: 'India', currency: 'INR', sampleRate: 61.2,
    methods: [
      { id: 'in-upi', type: 'bank', name: 'Bank account (UPI or IMPS)', eta: 'Within minutes', feeMinor: 299 },
      { id: 'in-neft', type: 'bank', name: 'Bank account (NEFT)', eta: 'Same day', feeMinor: 199 },
    ],
  },
  {
    countryCode: 'PK', countryName: 'Pakistan', currency: 'PKR', sampleRate: 203,
    methods: [
      { id: 'pk-wallet', type: 'mobile_wallet', name: 'Mobile wallet', eta: 'Within minutes', feeMinor: 299 },
      { id: 'pk-bank', type: 'bank', name: 'Bank deposit', eta: 'Same day', feeMinor: 399 },
      { id: 'pk-cash', type: 'cash_pickup', name: 'Cash pickup', eta: 'Within minutes', feeMinor: 499 },
    ],
  },
  {
    countryCode: 'NG', countryName: 'Nigeria', currency: 'NGN', sampleRate: 1150,
    methods: [
      { id: 'ng-bank', type: 'bank', name: 'Bank deposit', eta: 'Within minutes', feeMinor: 399 },
      { id: 'ng-mobile', type: 'mobile_wallet', name: 'Mobile money', eta: 'Within minutes', feeMinor: 349 },
    ],
  },
  {
    countryCode: 'EG', countryName: 'Egypt', currency: 'EGP', sampleRate: 35,
    methods: [
      { id: 'eg-bank', type: 'bank', name: 'Bank deposit', eta: 'Same day', feeMinor: 399 },
      { id: 'eg-cash', type: 'cash_pickup', name: 'Cash pickup', eta: 'Within minutes', feeMinor: 499 },
    ],
  },
  {
    countryCode: 'MX', countryName: 'Mexico', currency: 'MXN', sampleRate: 13.6,
    methods: [
      { id: 'mx-spei', type: 'bank', name: 'Bank deposit (SPEI)', eta: 'Within minutes', feeMinor: 299 },
      { id: 'mx-cash', type: 'cash_pickup', name: 'Cash pickup', eta: 'Within minutes', feeMinor: 499 },
    ],
  },
  {
    countryCode: 'GB', countryName: 'United Kingdom', currency: 'GBP', sampleRate: 0.54,
    methods: [
      { id: 'gb-fps', type: 'bank', name: 'Bank account (Faster Payments)', eta: 'Within minutes', feeMinor: 199 },
    ],
  },
];

export function findCorridor(countryCode: string): Corridor | undefined {
  return CORRIDORS.find((c) => c.countryCode === countryCode.toUpperCase());
}
