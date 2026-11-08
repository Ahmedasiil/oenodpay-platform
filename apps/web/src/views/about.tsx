import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { IconChip } from "@/components/icon";
import { PROVINCES, VALUES } from "@/content/company";
import { ctx, pageMeta } from "@/i18n/server";
import type { Locale } from "@/i18n";

const PATH = "/about";

const REGS = [
  ["FINTRAC", "Money services business registration", "Required to send money and hold customer funds", "Applying before launch"],
  ["Bank of Canada", "Payment service provider registration (Retail Payment Activities Act)", "Required to hold funds and process payments", "Applying before launch"],
  ["Quebec AMF", "Money services business licence", "Required to serve customers in Quebec", "After launch"],
  ["Card issuing partner", "Visa debit cards issued by a Canadian member financial institution", "Required for the oenodPay card", "Partner selection"],
  ["Investment dealer partner", "CIRO-regulated dealer", "Required for investing", "Before investing launches"],
] as const;

export const meta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, PATH, t("About us"), t("Who we are, where we operate and how we're regulated."));
};

export default function About({ lang }: { lang: Locale }) {
  const { t, l, r } = ctx(lang);
  return (
    <PageShell lang={lang} path={PATH} eyebrow={t("Company")} title={t("One app for all your money,")} accent={t("made in Canada.")}
      stats={[{ k: t("Provinces and territories at launch"), v: t("12 of 13") }, { k: t("Features in one app"), v: "11" }, { k: t("Countries you can send to"), v: "7" }]} lead={t("oenodPay is built by OENOD for people who live in Canada and have family, plans and money that cross borders.")} crumbs={[{ href: PATH, t: t("About us") }]}
      actions={<><Link href={l("/careers")} className="btn light">{t("Join the team")}</Link><Link href={l("/press")} className="btn line">{t("Press")}</Link></>}>
      <section className="pg">
        <div className="wrap">
          <h2>{t("Why we exist")}</h2>
          <p className="sub">{t("Newcomers and families in Canada juggle a bank, a transfer app, a prepaid card, a travel site and a credit app. Each has its own fees and its own sign-in. oenodPay puts them in one place with one balance, clear prices and strong security.")}</p>
          <div className="grid2">{VALUES.map((v, i) => <div key={v.t} className="box"><IconChip name={["scale", "shield", "globe", "doc"][i] ?? "check"} /><h3>{t(v.t)}</h3><p>{t(v.b)}</p></div>)}</div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap">
          <h2>{t("Where we operate")}</h2>
          <p className="sub">{t("We're launching across Canada. Quebec follows once we hold our licence from the Autorité des marchés financiers.")}</p>
          <div className="grid3">{PROVINCES.map((p) => <div key={p.name} className="box"><h3>{t(p.name)}</h3><span className={`tag${p.status === "At launch" ? " ok" : " later"}`}>{t(p.status)}</span></div>)}</div>
        </div>
      </section>
      <section className="pg" id="regulation">
        <div className="wrap">
          <h2>{t("How we're regulated")}</h2>
          <p className="sub">{t("We register with every regulator that oversees what we do, before we do it. This table shows honest, current status.")}</p>
          <div className="tblwrap"><table className="tbl">
            <thead><tr><th>{t("Regulator or partner")}</th><th>{t("What")}</th><th>{t("Why")}</th><th>{t("Status")}</th></tr></thead>
            <tbody>{REGS.map(([a, b, c, d]) => <tr key={a}><td><b>{t(a)}</b></td><td>{t(b)}</td><td>{t(c)}</td><td>{t(d)}</td></tr>)}</tbody>
          </table></div>
          <p className="note">{r(t("oenodPay is not a bank and does not take deposits. See <0>licences and registrations</0> for details."), ["/legal/regulatory"])}</p>
        </div>
      </section>
    </PageShell>
  );
}
