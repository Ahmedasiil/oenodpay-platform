/** Every string on the home page, menu, footer, calculator, sign-up and cookie banner. */
export interface Dict {
  nav: { personal: string; sendMoney: string; company: string; support: string; signIn: string; early: string; menu: string; language: string; madeFor: string; newcomers: string; business: string; allFeatures: string; countries: string; allCountries: string; about: string; trust: string; security: string; careers: string; press: string; licences: string; help: string; fees: string; contact: string; scams: string; status: string; legal: string; sendTo: string };
  hero: { pill: string; h1a: string; h1b: string; lead: string; cta1: string; cta2: string; small: string };
  fc: { maria: string; mariaSub: string; device: string; deviceSub: string; score: string; scoreSub: string };
  trust: string[];
  all: { eyebrow: string; h2: string; p: string };
  groups: { move: string; spend: string; grow: string };
  f: Record<"send-money-abroad" | "wallet-transfers" | "pay-bills" | "debit-card" | "travel" | "esim" | "rewards" | "credit-score" | "invest" | "loans" | "lend", { n: string; t: string }>;
  soon: string;
  how: { eyebrow: string; h2: string; steps: { t: string; b: string }[] };
  bento: { eyebrow: string; h2: string; p: string; try: string; more: string; tried: string };
  send: { eyebrow: string; h2a: string; h2b: string; h2c: string; p: string; items: { t: string; b: string }[]; link: string };
  calc: { send: string; fee: string; rate: string; arrives: string; get: string; cta: string; live: string; est: string; note: string; min: string; max: string };
  stats: { b: string; s: string }[];
  made: { nt: string; nb: string; nm: string; bt: string; bb: string; bm: string };
  sec: { eyebrow: string; h2: string; p: string; items: { t: string; b: string }[]; trust: string; how: string };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  join: { h2: string; p: string; placeholder: string; button: string; sending: string; done: string; errEmail: string; errBusy: string; errGeneric: string };
  foot: { tagline: string; legal: string; rights: string; soon: string; translated: string; cookieSettings: string };
  cookie: { title: string; body: string; policy: string; essential: string; essentialB: string; analytics: string; analyticsB: string; acceptAll: string; essentialOnly: string; choose: string; save: string };
}
