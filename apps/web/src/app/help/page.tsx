import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { HELP } from "@/content/help";

export const metadata: Metadata = { title: "Help centre | oenodPay", description: "Answers about accounts, identity verification, sending money, your card, security and fees." };

export default function Help() {
  return (
    <PageShell eyebrow="Support" title="How can we help?" lead="Answers to the questions people ask most. Can't find yours? Contact us and a person will reply." crumbs={[{ href: "/help", t: "Help centre" }]}
      actions={<Link href="/contact" className="btn light">Contact us</Link>}>
      <section className="pg">
        <div className="wrap">
          <div className="grid3">
            {HELP.map((t) => (
              <Link key={t.slug} href={`/help/${t.slug}`} className="box">
                <h3>{t.title}</h3><p>{t.blurb}</p>
                <p style={{ fontSize: 14 }}>{t.articles.length} articles</p>
                <span className="more">Browse →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap">
          <h2>Popular questions</h2>
          <div className="faq2">{HELP.map((t) => t.articles[0]!).map((a) => <details key={a.q}><summary>{a.q}</summary>{a.a.map((p, i) => <p key={i}>{p}</p>)}</details>)}</div>
        </div>
      </section>
    </PageShell>
  );
}
