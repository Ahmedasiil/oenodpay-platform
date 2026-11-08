import { PageShell } from "@/components/page-shell";
import { PRICING } from "@/content/company";
import { ctx, pageMeta } from "@/i18n/server";
import type { Locale } from "@/i18n";

const PATH = "/pricing";

export const meta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, PATH, t("Fees and limits"), t("Every oenodPay fee and limit in one place. No monthly fee."));
};

export default function Pricing({ lang }: { lang: Locale }) {
  const { t, r } = ctx(lang);
  const row = (k: string, v: string) => <div className="gl-row"><span>{k}</span><b>{v}</b></div>;
  return (
    <PageShell lang={lang} path={PATH} eyebrow={t("Fees and limits")} title={t("Every price, in one place")}
      aside={<div className="glass"><h3>{t("Your account")}</h3><div className="big">$0<span style={{ fontSize: 18, color: "rgba(255,255,255,.6)" }}> {t("/month")}</span></div>{row(t("Opening an account"), t("Free"))}{row(t("Sending to oenodPay users"), t("Free, instant"))}{row(t("Card fee"), t("None"))}{row(t("Inactivity fee"), t("None"))}</div>}
      lead={t("No monthly fee and no hidden exchange markups. If something costs money, it's on this page and shown before you confirm.")} crumbs={[{ href: PATH, t: t("Fees and limits") }]}>
      <section className="pg">
        <div className="wrap" style={{ maxWidth: 900 }}>
          {PRICING.map((g) => (
            <div key={g.group}>
              <h2>{t(g.group)}</h2>
              <div className="tblwrap"><table className="tbl"><tbody>{g.rows.map(([k, v]) => <tr key={k}><td>{t(k)}</td><td>{t(v)}</td></tr>)}</tbody></table></div>
            </div>
          ))}
          <p className="note">{r(t("Exchange rates on international transfers are shown before you send and locked for 30 minutes. Limits go up as your account history grows, and can be lowered at any time in Settings. See the <0>account agreement</0> and <1>cardholder agreement</1> for full terms. Fees for loans, investing and Lend are set out in their own disclosures."), ["/legal/account-agreement", "/legal/cardholder-agreement"])}</p>
        </div>
      </section>
    </PageShell>
  );
}
