import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { FEATURES, FEATURE_ICON } from "@/content/features";
import { IconChip } from "@/components/icon";
import { ctx, pageMeta } from "@/i18n/server";
import { deepT } from "@/i18n/t";
import type { Locale } from "@/i18n";

const PATH = "/features";
const GROUPS = [["Move money", "Move money anywhere"], ["Spend & travel", "Spend and travel smarter"], ["Grow your money", "Grow what you have"]] as const;

export const meta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, PATH, t("Features"), t("Everything oenodPay does: send money abroad, pay bills, a Visa debit card, travel, eSIMs, rewards, credit score, investing, loans and Lend."));
};

export default function Features({ lang }: { lang: Locale }) {
  const { t, l } = ctx(lang);
  return (
    <PageShell lang={lang} path={PATH} eyebrow={t("Personal")} title={t("Everything your money needs,")} accent={t("in one app.")}
      stats={[{ k: t("Features"), v: "11" }, { k: t("Balance for all of them"), v: "1" }, { k: t("Monthly fee"), v: "$0" }, { k: t("Countries to send to"), v: "7" }]}
      lead={t("Eleven features that work from one balance. Pick one to see how it works, what it costs and what you need.")} crumbs={[{ href: PATH, t: t("Features") }]}>
      {GROUPS.map(([g, h], i) => (
        <section key={g} className={`pg${i % 2 ? " alt" : ""}`}>
          <div className="wrap">
            <span className="eyebrow">{t(g)}</span>
            <h2>{t(h)}</h2>
            <div className="grid3">
              {FEATURES.filter((f) => f.group === g).map((f) => {
                const x = deepT(f, t);
                return (
                  <Link key={f.slug} href={l(`/features/${f.slug}`)} className="box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><IconChip name={FEATURE_ICON[f.slug] ?? "check"} /><span className={`tag${f.status === "At launch" ? " ok" : " later"}`}>{t(f.status)}</span></div>
                    <h3>{x.name}</h3>
                    <p>{x.tagline}</p>
                    <span className="more">{t("Learn more →")}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </PageShell>
  );
}
