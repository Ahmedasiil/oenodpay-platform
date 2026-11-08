import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { FEATURES, featureBySlug } from "@/content/features";

export const generateStaticParams = () => FEATURES.map((f) => ({ slug: f.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = featureBySlug((await params).slug);
  return f ? { title: `${f.name} | oenodPay`, description: f.tagline } : {};
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const f = featureBySlug((await params).slug);
  if (!f) notFound();
  const others = FEATURES.filter((o) => o.group === f.group && o.slug !== f.slug);
  return (
    <PageShell eyebrow={`${f.group} · ${f.status}`} title={f.name} lead={f.intro}
      crumbs={[{ href: "/features", t: "Features" }, { href: `/features/${f.slug}`, t: f.name }]}
      actions={<><Link href="/#join" className="btn light">Get early access</Link><Link href="/#features" className="btn line">Try the demo</Link></>}>
      <section className="pg">
        <div className="wrap">
          <h2>How it works</h2>
          <div className="steps">{f.steps.map((s) => <div key={s.t} className="box"><h3>{s.t}</h3><p>{s.b}</p></div>)}</div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div><h2>Key facts</h2><dl className="facts">{f.facts.map((x) => <div key={x.k}><dt>{x.k}</dt><dd>{x.v}</dd></div>)}</dl></div>
          <div><h2>What you need</h2><ul className="checks">{f.needs.map((n) => <li key={n}>{n}</li>)}</ul></div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <h2>Questions</h2>
          <div className="faq2">{f.faq.map((q) => <details key={q.q}><summary>{q.q}</summary><p>{q.a}</p></details>)}</div>
          {f.legal && f.legal.length > 0 && (
            <p className="note" style={{ marginTop: 32 }}>Read the full terms: {f.legal.map((l, i) => <span key={l.href}>{i ? ", " : ""}<Link href={l.href}>{l.label}</Link></span>)}.</p>
          )}
        </div>
      </section>
      {others.length > 0 && (
        <section className="pg alt">
          <div className="wrap">
            <h2>More in {f.group}</h2>
            <div className="grid3">{others.map((o) => <Link key={o.slug} href={`/features/${o.slug}`} className="box"><h3>{o.name}</h3><p>{o.tagline}</p><span className="more">Learn more →</span></Link>)}</div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
