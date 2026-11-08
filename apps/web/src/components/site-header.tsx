import Link from "next/link";

export function SiteHeader() {
  return (
    <nav className="lp nav" aria-label="Main">
      <div className="wrap">
        <Link href="/" className="logo" aria-label="oenodPay home" style={{ textDecoration: "none", color: "#fff" }}>
          oenod<b>Pay</b>
        </Link>
        <ul>
          <li><Link href="/#features">Features</Link></li>
          <li><Link href="/#how">How it works</Link></li>
          <li><Link href="/#security">Security</Link></li>
          <li><Link href="/#faq">Questions</Link></li>
        </ul>
        <Link href="/signin" className="btn line">Sign in</Link>
        <Link href="/#join" className="btn light">Get early access</Link>
      </div>
    </nav>
  );
}
