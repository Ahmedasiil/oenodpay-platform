import Link from "next/link";
import { FEATURES } from "@/content/features";
import { COUNTRIES } from "@/content/countries";
import { LEGAL } from "@/content/legal";

export function SiteFooter() {
  const cols: { h: string; links: { href: string; t: string }[] }[] = [
    { h: "Personal", links: FEATURES.map((f) => ({ href: `/features/${f.slug}`, t: f.name })) },
    { h: "Send money to", links: [...COUNTRIES.map((c) => ({ href: `/send-money/${c.slug}`, t: c.countryName })), { href: "/send-money", t: "All countries" }] },
    { h: "Company", links: [{ href: "/about", t: "About us" }, { href: "/security", t: "Security" }, { href: "/careers", t: "Careers" }, { href: "/press", t: "Press" }, { href: "/legal/regulatory", t: "Licences" }] },
    { h: "Support", links: [{ href: "/help", t: "Help centre" }, { href: "/pricing", t: "Fees and limits" }, { href: "/contact", t: "Contact us" }, { href: "/legal/complaints", t: "Complaints" }, { href: "/legal/accessibility", t: "Accessibility" }] },
    { h: "Legal", links: LEGAL.filter((d) => ["terms", "account-agreement", "cardholder-agreement", "privacy", "cookies", "aml-sanctions", "acceptable-use"].includes(d.slug)).map((d) => ({ href: `/legal/${d.slug}`, t: d.title })).concat({ href: "/legal", t: "All legal documents" }) },
  ];
  return (
    <footer className="lp foot3">
      <div className="wrap">
        <div className="f-top">
          <div className="f-brand">
            <span className="logo">oenod<b>Pay</b></span>
            <p>All your money, one simple app. A product of OENOD, launching first in Canada.</p>
          </div>
          {cols.map((c) => (
            <div key={c.h} className="f-col">
              <span className="f-h">{c.h}</span>
              {c.links.map((l) => <Link key={l.href} href={l.href}>{l.t}</Link>)}
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
