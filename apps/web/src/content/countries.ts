import { CORRIDORS, type Corridor, type PayoutMethodType } from "@oenodpay/shared";

/** Extra details for each country page. Rates and fees come from the shared corridor list. */
interface CountryInfo { slug: string; capital: string; notes: string[]; popular: string }

const INFO: Record<string, CountryInfo> = {
  PH: { slug: "philippines", capital: "Manila", popular: "Mobile wallet", notes: ["Mobile wallet payouts go to wallets registered in the recipient's name.", "Cash pickup is available at partner locations across the country."] },
  IN: { slug: "india", capital: "New Delhi", popular: "Bank account (UPI or IMPS)", notes: ["Bank payouts need the account number and IFSC code, or a UPI ID.", "Only bank deposits are available to India; cash pickup is not."] },
  PK: { slug: "pakistan", capital: "Islamabad", popular: "Mobile wallet", notes: ["Bank payouts need the IBAN.", "Mobile wallet payouts go to wallets registered with the recipient's CNIC."] },
  NG: { slug: "nigeria", capital: "Abuja", popular: "Bank deposit", notes: ["Bank payouts need the 10-digit NUBAN account number and bank name.", "Payouts are made in naira."] },
  EG: { slug: "egypt", capital: "Cairo", popular: "Cash pickup", notes: ["Bank payouts need the IBAN.", "Cash pickup needs the recipient's national ID card or passport."] },
  MX: { slug: "mexico", capital: "Mexico City", popular: "Bank deposit (SPEI)", notes: ["Bank payouts need the 18-digit CLABE.", "Cash pickup is available at partner stores nationwide."] },
  GB: { slug: "united-kingdom", capital: "London", popular: "Bank account (Faster Payments)", notes: ["Bank payouts need the sort code and account number.", "Most payments arrive within minutes, 24/7."] },
};

export const RECIPIENT_NEEDS: Record<PayoutMethodType, string[]> = {
  bank: ["Full legal name, matching the bank account", "Bank name and account number in the local format", "Recipient's address (some banks require it)"],
  mobile_wallet: ["Full legal name, matching the wallet registration", "Mobile number linked to the wallet, with country code"],
  cash_pickup: ["Full legal name, exactly as on their ID", "Valid government photo ID to show at pickup", "The reference number we send you after the transfer"],
};

export const SENDER_NEEDS = [
  "A verified oenodPay account: Canadian resident, 18 or older, government photo ID and a selfie",
  "Your Canadian address and date of birth",
  "The purpose of the transfer (family support, gift, education, and so on)",
  "For larger amounts, we may ask for the source of the funds, as Canadian anti-money-laundering rules require",
];

export interface Country extends Corridor, CountryInfo {}

export const COUNTRIES: Country[] = CORRIDORS.map((c) => ({ ...c, ...INFO[c.countryCode]! }));
export const countryBySlug = (slug: string) => COUNTRIES.find((c) => c.slug === slug);
export const LABEL = { bank: "Bank deposit", mobile_wallet: "Mobile wallet", cash_pickup: "Cash pickup" } as const;
