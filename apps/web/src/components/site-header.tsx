import Link from "next/link";
import { FEATURES } from "@/content/features";
import { COUNTRIES } from "@/content/countries";

const COMPANY = [
  { href: "/about", t: "About us", d: "Who we are and where we operate" },
  { href: "/security", t: "Security", d: "How we protect your money and data" },
  { href: "/careers", t: "Careers", d: "Join the team" },
  { href: "/press", t: "Press", d: "News and media kit" },
  { href: "/legal/regulatory", t: "Licences", d: "Registrations and their status" },
];
const SUPPORT = [
  { href: "/help", t: "Help centre", d: "Answers to common questions" },
  { href: "/pricing", t: "Fees and limits", d: "Every price in one place" },
  { href: "/contact", t: "Contact us", d: "Support, complaints, privacy" },
  { href: "/legal", t: "Legal", d: "Agreements and policies" },
];

function Menu({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <li className="mm">
      <button type="button" className="mm-btn" aria-haspopup="true">{label} <span aria-hidden="true">▾</span></button>
      <div className={`mm-panel${wide ? " wide" : ""}`}>{children}</div>
    </li>
  );
}

const Item = ({ href, t, d }: { href: string; t: string; d?: string }) => (
  <Link href={href} className="mm-item"><b>{t}</b>{d && <span>{d}</span>}</Link>
);

export function SiteHeader() {
  const groups = ["Move money", "Spend & travel", "Grow your money"] as const;
  return (
    <nav className="lp nav" aria-label="Main">
      <div className="wrap">
        <Link href="/" className="logo" aria-label="oenodPay home" style={{ textDecoration: "none", color: "#fff" }}>
          oenod<b>Pay</b>
        </Link>
        <ul className="mm-list">
          <Menu label="Personal" wide>
            {groups.map((g) => (
              <div key={g} className="mm-col">
                <span className="mm-h">{g}</span>
                {FEATURES.filter((f) => f.group === g).map((f) => <Item key={f.slug} href={`/features/${f.slug}`} t={f.name} d={f.tagline} />)}
              </div>
            ))}
          </Menu>
          <Menu label="Send money">
            <div className="mm-col">
              <span className="mm-h">Countries</span>
              {COUNTRIES.map((c) => <Item key={c.slug} href={`/send-money/${c.slug}`} t={`Send to ${c.countryName}`} />)}
              <Item href="/send-money" t="All countries and requirements" />
            </div>
          </Menu>
          <Menu label="Company"><div className="mm-col">{COMPANY.map((i) => <Item key={i.href} {...i} />)}</div></Menu>
          <Menu label="Support"><div className="mm-col">{SUPPORT.map((i) => <Item key={i.href} {...i} />)}</div></Menu>
        </ul>
        <Link href="/signin" className="btn line">Sign in</Link>
        <Link href="/#join" className="btn light">Get early access</Link>
        <details className="mob">
          <summary aria-label="Open menu">Menu</summary>
          <div className="mob-panel">
            <span className="mm-h">Personal</span>
            {FEATURES.map((f) => <Link key={f.slug} href={`/features/${f.slug}`}>{f.name}</Link>)}
            <span className="mm-h">Send money</span>
            <Link href="/send-money">Countries and requirements</Link>
            <span className="mm-h">Company and support</span>
            {[...COMPANY, ...SUPPORT].map((i) => <Link key={i.href} href={i.href}>{i.t}</Link>)}
            <Link href="/signin">Sign in</Link>
          </div>
        </details>
      </div>
    </nav>
  );
}
