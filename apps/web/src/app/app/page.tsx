import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { QuoteCalculator } from "./quote-calculator";

export const metadata = { title: "oenodPay web app" };

export default function WebApp() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="flex flex-col gap-4">
          <div className="rounded-3xl bg-navy text-white p-6 flex flex-col gap-3">
            <span className="text-sm font-semibold opacity-75">oenodPay wallet · CAD</span>
            <span className="font-display text-5xl font-bold tracking-tight">$2,480.50</span>
            <span className="text-xs opacity-70">Sample balance. Sign-in connects to the same account as the mobile app.</span>
          </div>
          <div className="rounded-3xl bg-surface border border-line p-6 flex flex-col gap-2">
            <h2 className="font-semibold">Your account</h2>
            <p className="text-sm text-muted">
              Sign in with a passkey or password. It&apos;s the same oenodPay account and backend as the iOS and Android apps.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/signin" className="h-11 px-4 rounded-xl bg-brand text-white flex items-center font-semibold hover:bg-brand-dark">Sign in</Link>
              <Link href="/app/security" className="h-11 px-4 rounded-xl border border-line flex items-center font-semibold">Security &amp; devices</Link>
            </div>
          </div>
        </section>
        <QuoteCalculator />
      </main>
    </>
  );
}
