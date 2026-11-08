import Link from "next/link";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/** Every inner page: dark header, navy page hero, content, big footer. */
export function PageShell({ eyebrow, title, lead, crumbs, children, actions }: {
  eyebrow: string; title: string; lead?: string; crumbs?: { href: string; t: string }[];
  children: React.ReactNode; actions?: React.ReactNode;
}) {
  return (
    <div className="lp" style={{ flex: 1 }}>
      <SiteHeader />
      <header className="phero">
        <div className="wrap">
          {crumbs && (
            <nav aria-label="Breadcrumb" className="crumbs">
              <Link href="/">Home</Link>
              {crumbs.map((c) => <span key={c.href}> / <Link href={c.href}>{c.t}</Link></span>)}
            </nav>
          )}
          <span className="pill">{eyebrow}</span>
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {actions && <div className="ctas">{actions}</div>}
        </div>
      </header>
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
