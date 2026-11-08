import Link from "next/link";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Reveal } from "./reveal";

/** Every inner page: dark header, navy page hero (with optional visual), content, closing CTA, big footer. */
export function PageShell({ eyebrow, title, accent, lead, crumbs, children, actions, aside, stats, cta = true }: {
  eyebrow: string; title: string; accent?: string; lead?: string; crumbs?: { href: string; t: string }[];
  children: React.ReactNode; actions?: React.ReactNode; aside?: React.ReactNode;
  stats?: { k: string; v: string }[]; cta?: boolean;
}) {
  return (
    <div className="lp" style={{ flex: 1 }}>
      <SiteHeader />
      <header className={`phero${aside ? " split" : ""}`}>
        <div className="wrap phero-grid">
          <div className="phero-tx">
            {crumbs && (
              <nav aria-label="Breadcrumb" className="crumbs">
                <Link href="/">Home</Link>
                {crumbs.map((c) => <span key={c.href}><span aria-hidden="true"> / </span><Link href={c.href}>{c.t}</Link></span>)}
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
                <h2>Ready when you are.</h2>
                <p>Join early access and be one of the first in Canada to open an oenodPay account.</p>
              </div>
              <div className="ctas">
                <Link href="/#join" className="btn light">Get early access</Link>
                <Link href="/contact" className="btn line">Talk to us</Link>
              </div>
            </div>
          </div>
        </section>
      )}
      <SiteFooter />
    </div>
  );
}
