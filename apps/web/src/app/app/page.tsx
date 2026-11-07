import { SiteHeader } from "@/components/site-header";
import { QuoteCalculator } from "./quote-calculator";

export const metadata = { title: "oenodPay web app" };

export default function WebApp() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="flex flex-col gap-4">
          <div className="rounded-3xl bg-ink text-white p-6 flex flex-col gap-3">
            <span className="text-sm text-mist">oenodPay wallet · CAD</span>
            <span className="font-display text-4xl font-semibold">$2,480.50</span>
            <span className="text-xs text-mist">Sample balance. Sign-in connects to the same account as the mobile app.</span>
          </div>
          <div className="rounded-3xl bg-white border border-line p-6 flex flex-col gap-2">
            <h2 className="font-semibold">Sign in</h2>
            <p className="text-sm text-muted">
              Passkey sign-in for the web is coming next. It uses the same oenodPay account and backend as the iOS and Android apps.
            </p>
          </div>
        </section>
        <QuoteCalculator />
      </main>
    </>
  );
}
