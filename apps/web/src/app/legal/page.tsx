import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { LEGAL, LEGAL_GROUPS } from "@/content/legal";

export const metadata: Metadata = { title: "Legal | oenodPay", description: "Every oenodPay agreement, policy and disclosure in one place." };

export default function Legal() {
  return (
    <PageShell eyebrow="Legal" title="Agreements and policies" lead="Every agreement, policy and disclosure that applies to oenodPay, written in plain language." crumbs={[{ href: "/legal", t: "Legal" }]}>
      <section className="pg">
        <div className="wrap">
          <p className="note warn" style={{ marginBottom: 40 }}>These documents are drafts prepared before launch. They will be reviewed by legal counsel and finalized before oenodPay opens accounts. They don&apos;t create any obligations yet.</p>
          {LEGAL_GROUPS.map((g) => (
            <div key={g} style={{ marginBottom: 44 }}>
              <h2>{g}</h2>
              <div className="grid3">
                {LEGAL.filter((d) => d.group === g).map((d) => (
                  <Link key={d.slug} href={`/legal/${d.slug}`} className="box"><h3>{d.title}</h3><p>{d.summary}</p><span className="more">Read →</span></Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
