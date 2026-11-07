import Link from "next/link";
import { CORRIDORS } from "@oenodpay/shared";
import { SiteHeader } from "@/components/site-header";

const features = [
  { title: "Wallet and transfers", body: "Free instant transfers to other oenodPay users, plus Interac e-Transfer and EFT to any Canadian bank." },
  { title: "Bill pay", body: "Utilities, phone, internet and taxes in one list, with reminders and auto-pay." },
  { title: "Debit card", body: "A virtual card the moment you join, a physical Visa or Mastercard by mail, Apple Pay and Google Pay, freeze in one tap." },
  { title: "Travel", body: "Book flights and hotels, pay with your wallet or points, and earn rewards on every trip." },
  { title: "eSIM data", body: "Data plans for 190+ countries, installed in the app before you land." },
  { title: "Rewards", body: "Points on card spend, bills and referrals, redeemable for travel and eSIM." },
  { title: "Credit score", body: "Your free score and report, with alerts and tips to raise it." },
  { title: "Investing", body: "Buy Canadian and US stocks and ETFs, including fractional shares." },
];

const protections = [
  { title: "Passkeys, not passwords", body: "Sign in with Face ID or your fingerprint. Nothing to phish or reuse." },
  { title: "Trusted devices only", body: "A new phone must be approved from your current one, and SIM swaps are detected." },
  { title: "24/7 fraud monitoring", body: "Every login and payment is checked in real time, with scam warnings before risky transfers." },
  { title: "Encrypted and in Canada", body: "Data encrypted in transit and at rest, with keys in hardware and Canadian data stored in Canada." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
          <div className="flex flex-col gap-6">
            <span className="self-start text-[13px] font-semibold text-ink bg-brand-soft rounded-full px-3 py-1.5">Launching in Canada</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-[56px] leading-[1.05] font-semibold tracking-tight">
              One app to pay, send, travel and grow your money.
            </h1>
            <p className="text-lg leading-relaxed text-muted">
              Pay bills, send money to friends, banks and family abroad, book flights and hotels, buy eSIM data, get a debit
              card, check your credit and invest. On iPhone, Android and the web, with one secure account.
            </p>
            <div id="download" className="flex flex-wrap gap-3">
              <a href="#" className="h-13 px-6 rounded-2xl bg-black text-white flex items-center font-semibold">Download for iPhone</a>
              <a href="#" className="h-13 px-6 rounded-2xl bg-black text-white flex items-center font-semibold">Download for Android</a>
              <Link href="/app" className="h-13 px-6 rounded-2xl border border-black flex items-center font-semibold">Open web app</Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[300px] rounded-[40px] bg-black p-3.5">
              <div className="rounded-[28px] bg-canvas p-5 flex flex-col gap-3.5">
                <span className="text-[13px] text-muted">Good evening, Ahmed</span>
                <div className="rounded-[22px] bg-navy text-white p-4 flex flex-col gap-2">
                  <span className="text-xs font-semibold opacity-75">Total balance · CAD</span>
                  <span className="font-display text-[34px] leading-none font-bold tracking-tight">$2,480.50</span>
                </div>
                <div className="rounded-2xl bg-surface border border-line p-3">
                  <p className="text-[13px] font-semibold">Maria, Philippines</p>
                  <p className="text-xs text-muted">Sent to mobile wallet · arrived in 2 min</p>
                </div>
                <div className="rounded-2xl bg-surface border border-line p-3">
                  <p className="text-[13px] font-semibold">Electricity bill</p>
                  <p className="text-xs text-muted">Paid · auto-pay on</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="send" className="bg-black text-white">
          <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col gap-6">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Pick a country. See every way to send.</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-mist">
              Bank deposit, mobile wallet or cash pickup: oenodPay shows what works in each country, with the fee, the rate
              and the arrival time before you send.
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {CORRIDORS.map((c) => (
                <li key={c.countryCode} className="h-11 px-4 rounded-full border border-[#39405A] flex items-center">
                  {c.countryName}
                </li>
              ))}
              <li className="h-11 px-4 rounded-full bg-white text-black flex items-center font-semibold">More coming</li>
            </ul>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-16 flex flex-col gap-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Everything in one place</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="bg-surface border border-line rounded-3xl p-6 flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="loans" className="mx-auto max-w-6xl px-6 pb-16 grid gap-4 md:grid-cols-2">
          <div className="bg-surface border border-line rounded-3xl p-8 flex flex-col gap-3">
            <span className="text-sm font-semibold text-brand">Borrow</span>
            <h2 className="font-display text-3xl font-semibold">Loans that build your future</h2>
            <p className="leading-relaxed text-muted">
              Credit-builder loans for newcomers, personal loans with fixed payments, and Pay in 4 on travel and shopping.
              Check your rate without affecting your score.
            </p>
          </div>
          <div className="bg-black text-white rounded-3xl p-8 flex flex-col gap-3">
            <span className="text-sm font-semibold text-mint">Lend and earn</span>
            <h2 className="font-display text-3xl font-semibold">Fund loans, earn interest</h2>
            <p className="leading-relaxed text-mist">
              Subscribe to oenodPay Lend, choose your risk level, and get repayments plus interest back every month. Lending
              carries risk and is not CDIC insured.
            </p>
          </div>
        </section>

        <section id="security" className="bg-surface border-y border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col gap-8">
            <div className="max-w-2xl flex flex-col gap-3">
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Security built in from day one</h2>
              <p className="text-lg leading-relaxed text-muted">
                Your money and your identity are protected by the same kinds of controls banks use, on every device.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {protections.map((p) => (
                <div key={p.title} className="border border-line rounded-3xl p-6 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl w-full px-6 pt-10 pb-14 flex flex-wrap justify-between gap-6 text-sm text-muted">
        <p className="max-w-xl">
          [COMPANY LEGAL NAME]. [FINTRAC MSB AND BANK OF CANADA PSP REGISTRATION DETAILS]. oenodPay is not a bank. Wallet funds
          are held with [PARTNER INSTITUTION].
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-5 text-ink">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <Link href="/#security">Security</Link>
          <a href="#">Help</a>
        </nav>
      </footer>
    </>
  );
}
