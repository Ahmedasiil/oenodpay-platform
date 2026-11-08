import Link from "next/link";
import { FEATURES } from "@/content/features";
import { COUNTRIES } from "@/content/countries";
import { DICTS, LOCALES, homeHref, type Locale } from "@/i18n";

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

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" /></svg>
);

/** Language picker: plain links, so it works without JavaScript and every language has its own address. */
export function LangPicker({ lang }: { lang: Locale }) {
  const cur = LOCALES.find((l) => l.code === lang)!;
  return (
    <details className="lang">
      <summary aria-label={`${DICTS[lang].nav.language}: ${cur.name}`}><GlobeIcon /><span>{cur.code.toUpperCase()}</span></summary>
      <div className="lang-panel" role="list">
        {LOCALES.map((l) => (
          <a key={l.code} role="listitem" href={homeHref(l.code)} hrefLang={l.hreflang} lang={l.code} aria-current={l.code === lang ? "true" : undefined}>{l.name}</a>
        ))}
      </div>
    </details>
  );
}

export function SiteHeader({ lang = "en" }: { lang?: Locale }) {
  const t = DICTS[lang];
  const en = lang === "en";
  const groups = [["Move money", t.groups.move], ["Spend & travel", t.groups.spend], ["Grow your money", t.groups.grow]] as const;
  const name = (slug: string) => t.f[slug as keyof typeof t.f];
  const COMPANY = [
    { href: "/about", t: t.nav.about, d: en ? "Who we are and where we operate" : undefined },
    { href: "/trust", t: t.nav.trust, d: en ? "How we protect you and your money" : undefined },
    { href: "/security", t: t.nav.security, d: en ? "How we protect your money and data" : undefined },
    { href: "/careers", t: t.nav.careers, d: en ? "Join the team" : undefined },
    { href: "/press", t: t.nav.press, d: en ? "News and media kit" : undefined },
    { href: "/legal/regulatory", t: t.nav.licences, d: en ? "Registrations and their status" : undefined },
  ];
  const SUPPORT = [
    { href: "/help", t: t.nav.help, d: en ? "Answers to common questions" : undefined },
    { href: "/pricing", t: t.nav.fees, d: en ? "Every price in one place" : undefined },
    { href: "/contact", t: t.nav.contact, d: en ? "Support, complaints, privacy" : undefined },
    { href: "/scams", t: t.nav.scams, d: en ? "Spot a scam and what to do" : undefined },
    { href: "/status", t: t.nav.status, d: en ? "Live health of every service" : undefined },
    { href: "/legal", t: t.nav.legal, d: en ? "Agreements and policies" : undefined },
  ];
  return (
    <nav className="lp nav" aria-label="Main">
      <div className="wrap">
        <Link href={homeHref(lang)} className="logo" aria-label="oenodPay home" style={{ textDecoration: "none", color: "#fff" }} dir="ltr">
          oenod<b>Pay</b>
        </Link>
        <ul className="mm-list">
          <Menu label={t.nav.personal} wide>
            {groups.map(([g, label]) => (
              <div key={g} className="mm-col">
                <span className="mm-h">{label}</span>
                {FEATURES.filter((f) => f.group === g).map((f) => <Item key={f.slug} href={`/features/${f.slug}`} t={name(f.slug).n} d={name(f.slug).t} />)}
              </div>
            ))}
            <div className="mm-col">
              <span className="mm-h">{t.nav.madeFor}</span>
              <Item href="/newcomers" t={t.nav.newcomers} />
              <Item href="/business" t={t.nav.business} />
              <Item href="/features" t={t.nav.allFeatures} />
            </div>
          </Menu>
          <Menu label={t.nav.sendMoney}>
            <div className="mm-col">
              <span className="mm-h">{t.nav.countries}</span>
              {COUNTRIES.map((c) => <Item key={c.slug} href={`/send-money/${c.slug}`} t={en ? `Send to ${c.countryName}` : `${t.nav.sendTo} · ${c.countryName}`} />)}
              <Item href="/send-money" t={t.nav.allCountries} />
            </div>
          </Menu>
          <Menu label={t.nav.company}><div className="mm-col">{COMPANY.map((i) => <Item key={i.href} {...i} />)}</div></Menu>
          <Menu label={t.nav.support}><div className="mm-col">{SUPPORT.map((i) => <Item key={i.href} {...i} />)}</div></Menu>
        </ul>
        <LangPicker lang={lang} />
        <Link href="/signin" className="btn line">{t.nav.signIn}</Link>
        <Link href={`${homeHref(lang)}#join`} className="btn light">{t.nav.early}</Link>
        <details className="mob">
          <summary aria-label={t.nav.menu}>{t.nav.menu}</summary>
          <div className="mob-panel">
            <span className="mm-h">{t.nav.personal}</span>
            {FEATURES.map((f) => <Link key={f.slug} href={`/features/${f.slug}`}>{name(f.slug).n}</Link>)}
            <Link href="/newcomers">{t.nav.newcomers}</Link>
            <Link href="/business">{t.nav.business}</Link>
            <span className="mm-h">{t.nav.sendMoney}</span>
            <Link href="/send-money">{t.nav.allCountries}</Link>
            <span className="mm-h">{t.nav.company} · {t.nav.support}</span>
            {[...COMPANY, ...SUPPORT].map((i) => <Link key={i.href} href={i.href}>{i.t}</Link>)}
            <Link href="/signin">{t.nav.signIn}</Link>
          </div>
        </details>
      </div>
    </nav>
  );
}
