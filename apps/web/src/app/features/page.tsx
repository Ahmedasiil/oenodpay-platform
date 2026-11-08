import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { FEATURES, FEATURE_ICON } from "@/content/features";
import { IconChip } from "@/components/icon";

export const metadata: Metadata = { title: "Features | oenodPay", description: "Everything oenodPay does: send money abroad, pay bills, a Visa debit card, travel, eSIMs, rewards, credit score, investing, loans and Lend." };

export default function Features() {
  const groups = ["Move money", "Spend & travel", "Grow your money"] as const;
  return (
    <PageShell eyebrow="Personal" title="Everything your money needs," accent="in one app."
      stats={[{ k: "Features", v: "11" }, { k: "Balance for all of them", v: "1" }, { k: "Monthly fee", v: "$0" }, { k: "Countries to send to", v: "7" }]} lead="Eleven features that work from one balance. Pick one to see how it works, what it costs and what you need." crumbs={[{ href: "/features", t: "Features" }]}>
      {groups.map((g, i) => (
        <section key={g} className={`pg${i % 2 ? " alt" : ""}`}>
          <div className="wrap">
            <span className="eyebrow">{g}</span>
            <h2>{g === "Move money" ? "Move money anywhere" : g === "Spend & travel" ? "Spend and travel smarter" : "Grow what you have"}</h2>
            <div className="grid3">
              {FEATURES.filter((f) => f.group === g).map((f) => (
                <Link key={f.slug} href={`/features/${f.slug}`} className="box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><IconChip name={FEATURE_ICON[f.slug] ?? "check"} /><span className={`tag${f.status === "At launch" ? " ok" : " later"}`}>{f.status}</span></div>
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
