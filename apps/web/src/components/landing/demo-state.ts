/** State for the website's feature demos. Pretend money only, kept in cents to avoid rounding errors. */
export type FeatureId = "send" | "card" | "bills" | "esim" | "travel" | "invest" | "lend" | "credit";

export const ORDER: FeatureId[] = ["send", "bills", "card", "esim", "travel", "invest", "lend", "credit"];

export const FEATURES: Record<FeatureId, { name: string; points: number; hint: string }> = {
  send: { name: "Send money abroad", points: 50, hint: "Pick a country, choose how they receive it, then press Send." },
  bills: { name: "Pay bills", points: 30, hint: "Press Pay on any bill, or turn on autopay." },
  card: { name: "Visa debit card", points: 20, hint: "Turn on Freeze, then tap to pay for a coffee and see it get declined." },
  esim: { name: "Travel eSIM", points: 25, hint: "Choose where you're going and a plan, then buy it." },
  travel: { name: "Flights & hotels", points: 40, hint: "Pick a flight, switch on reward points, then book." },
  invest: { name: "Stocks & ETFs", points: 25, hint: "Press Buy $25 on any stock to own part of a share." },
  lend: { name: "oenodPay Lend", points: 35, hint: "Slide to pick an amount, choose a term, then press Lend." },
  credit: { name: "Credit score", points: 15, hint: "Turn the habits on and off and watch the score change." },
};

export const START_CENTS = 250_000;

export interface Activity { id: number; text: string; cents: number }

export interface DemoState {
  balance: number;
  points: number;
  tried: Partial<Record<FeatureId, true>>;
  activity: Activity[];
  card: { frozen: boolean; online: boolean; limitCents: number };
  bills: Record<string, true>;
  autopay: boolean;
  credit: { onTime: boolean; lowUse: boolean; builder: boolean };
  stocks: Record<string, number>;
  lentCents: number;
  esim: string | null;
  flight: string | null;
}

export const initialState = (): DemoState => ({
  balance: START_CENTS, points: 0, tried: {}, activity: [],
  card: { frozen: false, online: true, limitCents: 50_000 },
  bills: {}, autopay: false, credit: { onTime: true, lowUse: false, builder: false },
  stocks: {}, lentCents: 0, esim: null, flight: null,
});

let nextId = 1;

/** Takes money from the demo balance. Returns null when there isn't enough. */
export function spend(s: DemoState, id: FeatureId, cents: number, text: string): DemoState | null {
  if (cents <= 0 || cents > s.balance) return null;
  return {
    ...s,
    balance: s.balance - cents,
    points: s.points + FEATURES[id].points,
    tried: { ...s.tried, [id]: true },
    activity: [{ id: nextId++, text, cents: -cents }, ...s.activity].slice(0, 30),
  };
}

/** Marks a feature as tried without moving money (switches, toggles). */
export function touch(s: DemoState, id: FeatureId, text?: string): DemoState {
  const first = !s.tried[id];
  return {
    ...s,
    points: s.points + (first ? 5 : 0),
    tried: { ...s.tried, [id]: true },
    activity: text ? [{ id: nextId++, text, cents: 0 }, ...s.activity].slice(0, 30) : s.activity,
  };
}

export const cad = (cents: number) =>
  (cents < 0 ? "−" : "") + "$" + (Math.abs(cents) / 100).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Canadian 300 to 900 scale. */
export function creditScore(c: DemoState["credit"]): number {
  return 640 + (c.onTime ? 55 : -40) + (c.lowUse ? 38 : 0) + (c.builder ? 27 : 0);
}

export const LEND_RATES: Record<number, number> = { 6: 6.1, 12: 7.2, 24: 8.4 };

/** Simple interest on the lent amount for the term, in cents. */
export function lendEarnings(cents: number, months: number): number {
  return Math.round((cents * (LEND_RATES[months] ?? 0)) / 100 * (months / 12));
}
