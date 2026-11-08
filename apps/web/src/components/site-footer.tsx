import Link from "next/link";
import { FEATURES } from "@/content/features";
import { COUNTRIES } from "@/content/countries";
import { LEGAL } from "@/content/legal";
import { CookieSettingsButton } from "./cookie-consent";

export function SiteFooter() {
  const cols: { h: string; links: { href: string; t: string }[] }[] = [
    { h: "Personal", links: FEATURES.map((f) => ({ href: `/features/${f.slug}`, t: f.name })) },
    { h: "Send money to", links: [...COUNTRIES.map((c) => ({ href: `/send-money/${c.slug}`, t: c.countryName })), { href: "/send-money", t: "All countries" }] },
    { h: "Company", links: [{ href: "/about", t: "About us" }, { href: "/trust", t: "Trust centre" }, { href: "/newcomers", t: "New to Canada" }, { href: "/business", t: "Business" }, { href: "/security", t: "Security" }, { href: "/careers", t: "Careers" }, { href: "/press", t: "Press" }, { href: "/legal/regulatory", t: "Licences" }] },
    { h: "Support", links: [{ href: "/help", t: "Help centre" }, { href: "/pricing", t: "Fees and limits" }, { href: "/contact", t: "Contact us" }, { href: "/scams", t: "Scams and fraud" }, { href: "/status", t: "System status" }, { href: "/legal/complaints", t: "Complaints" }, { href: "/legal/accessibility", t: "Accessibility" }] },
    { h: "Legal", links: LEGAL.filter((d) => ["terms", "account-agreement", "cardholder-agreement", "privacy", "cookies", "aml-sanctions", "acceptable-use"].includes(d.slug)).map((d) => ({ href: `/legal/${d.slug}`, t: d.title })).concat({ href: "/legal", t: "All legal documents" }) },
  ];
  return (
    <footer className="lp foot3">
      <div className="wrap">
        <div className="f-top">
          <div className="f-brand">
            <span className="logo">oenod<b>Pay</b></span>
            <p>All your money, one simple app. A product of OENOD, launching first in Canada.</p>
            <div className="stores" aria-label="Apps coming soon">
              <span className="store"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM13.9 4.9c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3-1.5z"/></svg><span>Coming soon<b>App Store</b></span></span>
              <span className="store"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.6 2.3c-.3.3-.4.7-.4 1.2v17c0 .5.1.9.4 1.2l9.6-9.7zM14.3 13.1l2.9 2.9-11.6 6.6c-.4.2-.8.3-1.1.2zm0-2.2L4.5 1.1c.3-.1.7 0 1.1.2l11.6 6.6zM18.4 8.6l3 1.7c.9.5.9 1.8 0 2.3l-3 1.7-3.1-3.1z"/></svg><span>Coming soon<b>Google Play</b></span></span>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h} className="f-col">
              <span className="f-h">{c.h}</span>
              {c.links.map((l) => <Link key={l.href} href={l.href}>{l.t}</Link>)}
              {c.h === "Legal" && <CookieSettingsButton />}
            </div>
          ))}
        </div>
        <div className="f-legal">
          <p>oenodPay is a payment service, not a bank. Money in your oenodPay account is held separately from our own funds at a Canadian financial institution and is not covered by CDIC deposit insurance. oenodPay has not launched and does not yet accept customer funds; see <Link href="/legal/regulatory">licences and registrations</Link> for status. Visa is a trademark of Visa International Service Association.</p>
          <p>© 2026 OENOD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
