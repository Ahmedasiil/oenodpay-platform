import Link from "next/link";
import { FEATURES } from "@/content/features";
import { COUNTRIES } from "@/content/countries";
import { DICTS, LOCALES, homeHref, type Locale } from "@/i18n";
import { L, getT } from "@/i18n/t";

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
export function LangPicker({ lang, path = "/" }: { lang: Locale; path?: string }) {
  const cur = LOCALES.find((l) => l.code === lang)!;
  return (
    <details className="lang">
      <summary aria-label={`${DICTS[lang].nav.language}: ${cur.name}`}><GlobeIcon /><span>{cur.code.toUpperCase()}</span></summary>
      <div className="lang-panel" role="list">
        {LOCALES.map((l) => (
          <a key={l.code} role="listitem" href={L(l.code, path)} hrefLang={l.hreflang} lang={l.code} aria-current={l.code === lang ? "true" : undefined}>{l.name}</a>
        ))}
      </div>
    </details>
  );
}

export function SiteHeader({ lang = "en", path = "/" }: { lang?: Locale; path?: string }) {
  const t = DICTS[lang];
  const tr = getT(lang);
  const l = (p: string) => L(lang, p);
  const groups = [["Move money", t.groups.move], ["Spend & travel", t.groups.spend], ["Grow your money", t.groups.grow]] as const;
  const name = (slug: string) => t.f[slug as keyof typeof t.f];
  const COMPANY = [
    { href: "/about", t: t.nav.about, d: tr("Who we are and where we operate") },
    { href: "/trust", t: t.nav.trust, d: tr("How we protect you and your money") },
    { href: "/security", t: t.nav.security, d: tr("How we protect your money and data") },
    { href: "/careers", t: t.nav.careers, d: tr("Join the team") },
    { href: "/press", t: t.nav.press, d: tr("News and media kit") },
    { href: "/legal/regulatory", t: t.nav.licences, d: tr("Registrations and their status") },
  ];
  const SUPPORT = [
    { href: "/help", t: t.nav.help, d: tr("Answers to common questions") },
    { href: "/pricing", t: t.nav.fees, d: tr("Every price in one place") },
    { href: "/contact", t: t.nav.contact, d: tr("Support, complaints, privacy") },
    { href: "/scams", t: t.nav.scams, d: tr("Spot a scam and what to do") },
    { href: "/status", t: t.nav.status, d: tr("Live health of every service") },
    { href: "/legal", t: t.nav.legal, d: tr("Agreements and policies") },
  ];
  return (
    <nav className="lp nav" aria-label="Main">
      <div className="wrap">
        <Link href={homeHref(lang)} className="logo" aria-label="oenodPay home" dir="ltr">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/oenodpay-logo-white.svg" alt="OENODPAY" width={133} height={18} />
        </Link>
        <ul className="mm-list">
          <Menu label={t.nav.personal} wide>
            {groups.map(([g, label]) => (
              <div key={g} className="mm-col">
                <span className="mm-h">{label}</span>
                {FEATURES.filter((f) => f.group === g).map((f) => <Item key={f.slug} href={l(`/features/${f.slug}`)} t={name(f.slug).n} d={name(f.slug).t} />)}
              </div>
            ))}
            <div className="mm-col">
              <span className="mm-h">{t.nav.madeFor}</span>
              <Item href={l("/newcomers")} t={t.nav.newcomers} />
              <Item href={l("/business")} t={t.nav.business} />
              <Item href={l("/features")} t={t.nav.allFeatures} />
            </div>
          </Menu>
          <Menu label={t.nav.sendMoney}>
            <div className="mm-col">
              <span className="mm-h">{t.nav.countries}</span>
              {COUNTRIES.map((c) => <Item key={c.slug} href={l(`/send-money/${c.slug}`)} t={tr("Send to {country}", { country: tr(c.countryName) })} />)}
              <Item href={l("/send-money")} t={t.nav.allCountries} />
            </div>
          </Menu>
          <Menu label={t.nav.company}><div className="mm-col">{COMPANY.map((i) => <Item key={i.href} {...i} href={l(i.href)} />)}</div></Menu>
          <Menu label={t.nav.support}><div className="mm-col">{SUPPORT.map((i) => <Item key={i.href} {...i} href={l(i.href)} />)}</div></Menu>
        </ul>
        <LangPicker lang={lang} path={path} />
        <Link href="/signin" className="btn line">{t.nav.signIn}</Link>
        <Link href={`${homeHref(lang)}#join`} className="btn light">{t.nav.early}</Link>
        <details className="mob">
          <summary aria-label={t.nav.menu}>{t.nav.menu}</summary>
          <div className="mob-panel">
            <span className="mm-h">{t.nav.personal}</span>
            {FEATURES.map((f) => <Link key={f.slug} href={l(`/features/${f.slug}`)}>{name(f.slug).n}</Link>)}
            <Link href={l("/newcomers")}>{t.nav.newcomers}</Link>
            <Link href={l("/business")}>{t.nav.business}</Link>
            <span className="mm-h">{t.nav.sendMoney}</span>
            <Link href={l("/send-money")}>{t.nav.allCountries}</Link>
            <span className="mm-h">{t.nav.company} · {t.nav.support}</span>
            {[...COMPANY, ...SUPPORT].map((i) => <Link key={i.href} href={l(i.href)}>{i.t}</Link>)}
            <Link href="/signin">{t.nav.signIn}</Link>
          </div>
        </details>
      </div>
    </nav>
  );
}
