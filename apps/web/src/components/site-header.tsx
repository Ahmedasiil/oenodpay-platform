import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" aria-label="oenodPay home">
          <Image src="/oenodpay-logo-white.svg" alt="OENODPAY" width={172} height={36} priority />
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-6 text-[15px] font-medium">
          <Link href="/#send" className="hover:text-mist">Send money</Link>
          <Link href="/#features" className="hover:text-mist">Features</Link>
          <Link href="/#loans" className="hover:text-mist">Loans</Link>
          <Link href="/#security" className="hover:text-mist">Security</Link>
        </nav>
        <div className="flex gap-2">
          <Link href="/signin" className="h-11 px-4 rounded-xl border border-white/30 flex items-center font-semibold hover:bg-white/10">Sign in</Link>
          <Link href="/#download" className="h-11 px-4 rounded-xl bg-white text-navy flex items-center font-semibold hover:bg-mist">Get the app</Link>
        </div>
      </div>
    </header>
  );
}
