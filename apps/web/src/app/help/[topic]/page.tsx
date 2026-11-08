import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { HELP } from "@/content/help";

export const generateStaticParams = () => HELP.map((t) => ({ topic: t.slug }));
const find = (s: string) => HELP.find((t) => t.slug === s);

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const t = find((await params).topic);
  return t ? { title: `${t.title} | oenodPay help`, description: t.blurb } : {};
}

export default async function HelpTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const t = find((await params).topic);
  if (!t) notFound();
  return (
    <PageShell eyebrow="Help centre" title={t.title} lead={t.blurb} crumbs={[{ href: "/help", t: "Help centre" }, { href: `/help/${t.slug}`, t: t.title }]}>
      <section className="pg">
        <div className="wrap side">
          <nav className="toc" aria-label="Help topics">
            <span className="mm-h">Topics</span>
            {HELP.map((o) => <Link key={o.slug} href={`/help/${o.slug}`} aria-current={o.slug === t.slug ? "page" : undefined}>{o.title}</Link>)}
          </nav>
          <div>
            <div className="faq2">{t.articles.map((a) => <details key={a.q} open><summary>{a.q}</summary>{a.a.map((p, i) => <p key={i}>{p}</p>)}</details>)}</div>
            <p className="note" style={{ marginTop: 32 }}>Still need help? <Link href="/contact">Contact us</Link>. We reply within one business day.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
