import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="bg-white border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" aria-label="oenodPay home">
          {/* Text placeholder until the final logo is chosen. */}
          <span className="font-display text-xl font-semibold tracking-[0.18em]">OENODPAY</span>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-6 text-[15px] font-medium">
          <Link href="/#send" className="hover:text-brand">Send money</Link>
          <Link href="/#features" className="hover:text-brand">Features</Link>
          <Link href="/#loans" className="hover:text-brand">Loans</Link>
          <Link href="/#security" className="hover:text-brand">Security</Link>
        </nav>
        <div className="flex gap-2">
          <Link href="/signin" className="h-11 px-4 rounded-xl border border-[#D5D9E4] flex items-center font-semibold">Sign in</Link>
          <Link href="/#download" className="h-11 px-4 rounded-xl bg-brand text-white flex items-center font-semibold hover:bg-brand-dark">Get the app</Link>
        </div>
      </div>
    </header>
  );
}
