import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { LEGAL, legalBySlug } from "@/content/legal";

export const generateStaticParams = () => LEGAL.map((d) => ({ slug: d.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = legalBySlug((await params).slug);
  return d ? { title: `${d.title} | oenodPay`, description: d.summary } : {};
}

const id = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function LegalDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = legalBySlug((await params).slug);
  if (!d) notFound();
  return (
    <PageShell eyebrow={`Legal · ${d.group}`} title={d.title} lead={d.summary} crumbs={[{ href: "/legal", t: "Legal" }, { href: `/legal/${d.slug}`, t: d.title }]}>
      <section className="pg alt">
        <div className="wrap side">
          <nav className="toc" aria-label="On this page">
            <span className="mm-h">On this page</span>
            {d.sections.map((s) => <a key={s.h} href={`#${id(s.h)}`}>{s.h}</a>)}
            <span className="mm-h" style={{ marginTop: 16 }}>Related</span>
            {LEGAL.filter((o) => o.group === d.group && o.slug !== d.slug).map((o) => <Link key={o.slug} href={`/legal/${o.slug}`}>{o.title}</Link>)}
          </nav>
          <article className="prose">
            <p className="note warn" style={{ marginBottom: 28 }}>Draft for counsel review. This document will be finalized before oenodPay opens accounts. Last updated November 2026.</p>
            {d.sections.map((s) => (
              <section key={s.h}>
                <h2 id={id(s.h)}>{s.h}</h2>
                {s.p.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            ))}
            <p style={{ marginTop: 32 }}><Link href="/legal">← All agreements and policies</Link></p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
