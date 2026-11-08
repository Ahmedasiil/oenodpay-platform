import Link from "next/link";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Reveal } from "./reveal";
import { localeInfo, type Locale } from "@/i18n";
import { L, getT } from "@/i18n/t";

/** Every inner page: dark header, navy page hero (with optional visual), content, closing CTA, big footer. */
export function PageShell({ lang = "en", path = "/", eyebrow, title, accent, lead, crumbs, children, actions, aside, stats, cta = true }: {
  lang?: Locale; path?: string;
  eyebrow: string; title: string; accent?: string; lead?: string; crumbs?: { href: string; t: string }[];
  children: React.ReactNode; actions?: React.ReactNode; aside?: React.ReactNode;
  stats?: { k: string; v: string }[]; cta?: boolean;
}) {
  const t = getT(lang);
  const { dir } = localeInfo(lang);
  return (
    <div className="lp" style={{ flex: 1 }} lang={lang} dir={dir}>
      <SiteHeader lang={lang} path={path} />
      <header className={`phero${aside ? " split" : ""}`}>
        <div className="wrap phero-grid">
          <div className="phero-tx">
            {crumbs && (
              <nav aria-label={t("Breadcrumb")} className="crumbs">
                <Link href={L(lang, "/")}>{t("Home")}</Link>
                {crumbs.map((c) => <span key={c.href}><span aria-hidden="true"> / </span><Link href={L(lang, c.href)}>{c.t}</Link></span>)}
              </nav>
            )}
            <span className="pill">{eyebrow}</span>
            <h1>{title}{accent ? <> <span className="grad">{accent}</span></> : null}</h1>
            {lead && <p className="lead">{lead}</p>}
            {actions && <div className="ctas">{actions}</div>}
            {stats && (
              <dl className="phero-stats">
                {stats.map((s) => <div key={s.k}><dd>{s.v}</dd><dt>{s.k}</dt></div>)}
              </dl>
            )}
          </div>
          {aside && <div className="phero-aside">{aside}</div>}
        </div>
      </header>
      <main><Reveal />{children}</main>
      {cta && (
        <section className="cta-band">
          <div className="wrap">
            <div className="cta-in">
              <div>
                <h2>{t("Ready when you are.")}</h2>
                <p>{t("Join early access and be one of the first in Canada to open an oenodPay account.")}</p>
              </div>
              <div className="ctas">
                <Link href={L(lang, "/#join")} className="btn light">{t("Get early access")}</Link>
                <Link href={L(lang, "/contact")} className="btn line">{t("Talk to us")}</Link>
              </div>
            </div>
          </div>
        </section>
      )}
      <SiteFooter lang={lang} />
    </div>
  );
}
