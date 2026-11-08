import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { FEATURES } from "@/content/features";

export const metadata: Metadata = { title: "Features | oenodPay", description: "Everything oenodPay does: send money abroad, pay bills, a Visa debit card, travel, eSIMs, rewards, credit score, investing, loans and Lend." };

export default function Features() {
  const groups = ["Move money", "Spend & travel", "Grow your money"] as const;
  return (
    <PageShell eyebrow="Personal" title="Everything your money needs, in one app" lead="Eleven features that work from one balance. Pick one to see how it works, what it costs and what you need." crumbs={[{ href: "/features", t: "Features" }]}>
      {groups.map((g, i) => (
        <section key={g} className={`pg${i % 2 ? " alt" : ""}`}>
          <div className="wrap">
            <h2>{g}</h2>
            <div className="grid3">
              {FEATURES.filter((f) => f.group === g).map((f) => (
                <Link key={f.slug} href={`/features/${f.slug}`} className="box">
                  <span className={`tag${f.status === "At launch" ? "" : " later"}`}>{f.status}</span>
                  <h3>{f.name}</h3>
                  <p>{f.tagline}</p>
                  <span className="more">Learn more →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </PageShell>
  );
}
