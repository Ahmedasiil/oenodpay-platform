import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Calculator } from "@/components/calculator";
import { IconChip } from "@/components/icon";
import { COUNTRIES, LABEL, RECIPIENT_NEEDS, SENDER_NEEDS } from "@/content/countries";
import { calcProps, ctx, pageMeta } from "@/i18n/server";
import type { Locale } from "@/i18n";

const PATH = "/send-money";
const cad = (m: number) => `$${(m / 100).toFixed(2)}`;

export const meta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, PATH, t("Send money abroad from Canada"), t("Countries you can send to, how the money arrives, fees, and what you and your recipient need."));
};

export default function SendMoney({ lang }: { lang: Locale }) {
  const { t, l, r } = ctx(lang);
  return (
    <PageShell lang={lang} path={PATH} eyebrow={t("Send money")} title={t("Send money home.")} accent={t("See the price first.")} lead={t("See the fee and the exchange rate before you pay. Most transfers arrive within minutes.")} crumbs={[{ href: PATH, t: t("Send money") }]}
      actions={<Link href={l("/features/send-money-abroad")} className="btn light">{t("How sending works")}</Link>}
      aside={<Calculator {...calcProps(lang)} />}
      stats={[{ k: t("Countries"), v: "7" }, { k: t("Fees from"), v: "$1.99" }, { k: t("Most arrive"), v: t("In minutes") }]}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("Countries")}</span>
          <h2>{t("Where you can send at launch")}</h2>
          <p className="sub">{t("We're adding more countries after launch. Rates shown in the app are live; fees below are fixed per transfer.")}</p>
          <div className="grid3">
            {COUNTRIES.map((c) => (
              <Link key={c.slug} href={l(`/send-money/${c.slug}`)} className="box">
                <span className="tag">{c.currency}</span>
                <h3>{t(c.countryName)}</h3>
                <p>{c.methods.map((m) => t(m.name)).join(" · ")}</p>
                <p>{t("From {fee} per transfer", { fee: cad(Math.min(...c.methods.map((m) => m.feeMinor))) })}</p>
                <span className="more">{t("Requirements and fees →")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div>
            <h2>{t("What you need")}</h2>
            <ul className="checks">{SENDER_NEEDS.map((n) => <li key={n}>{t(n)}</li>)}</ul>
          </div>
          <div>
            <h2>{t("What your recipient needs")}</h2>
            {(Object.keys(RECIPIENT_NEEDS) as (keyof typeof RECIPIENT_NEEDS)[]).map((k) => (
              <div key={k} style={{ marginBottom: 20 }}><h3>{t(LABEL[k])}</h3><ul className="checks">{RECIPIENT_NEEDS[k].map((n) => <li key={n}>{t(n)}</li>)}</ul></div>
            ))}
          </div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <h2>{t("Rules every transfer follows")}</h2>
          <div className="grid3">
            <div className="box"><IconChip name="user" /><h3>{t("Identity checks")}</h3><p>{t("Canadian law requires us to verify who you are before your first transfer, and to keep records of every transfer.")}</p></div>
            <div className="box"><IconChip name="globe" /><h3>{t("Sanctions screening")}</h3><p>{t("Every sender and recipient is checked against Canadian and international sanctions lists. We can't send to sanctioned people or places.")}</p></div>
            <div className="box"><IconChip name="doc" /><h3>{t("Large transfers")}</h3><p>{t("Transfers of $10,000 or more, alone or within 24 hours, are reported to FINTRAC as the law requires. We may ask where the money came from.")}</p></div>
          </div>
          <p className="note" style={{ marginTop: 24 }}>{r(t("Full details are in our <0>anti-money-laundering and sanctions policy</0> and the <1>account agreement</1>."), ["/legal/aml-sanctions", "/legal/account-agreement"])}</p>
        </div>
      </section>
    </PageShell>
  );
}
