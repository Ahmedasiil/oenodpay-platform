import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { FEATURES } from "@/content/features";
import { ROLES, VALUES } from "@/content/company";
import { ctx, pageMeta } from "@/i18n/server";
import type { Locale } from "@/i18n";

/** Careers and press pages. */

export const careersMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/careers", t("Careers"), t("Open roles at oenodPay."));
};

export function Careers({ lang }: { lang: Locale }) {
  const { t, r } = ctx(lang);
  return (
    <PageShell lang={lang} path="/careers" eyebrow={t("Careers")} title={t("Help build the money app for everyone in Canada")} lead={t("We're a small team building payments, cards, travel and investing in one secure app.")} crumbs={[{ href: "/careers", t: t("Careers") }]}>
      <section className="pg">
        <div className="wrap">
          <h2>{t("Open roles")}</h2>
          <div className="tblwrap"><table className="tbl">
            <thead><tr><th>{t("Role")}</th><th>{t("Team")}</th><th>{t("Location")}</th></tr></thead>
            <tbody>{ROLES.map((x) => <tr key={x.t}><td><b>{t(x.t)}</b></td><td>{t(x.team)}</td><td>{t(x.where)}</td></tr>)}</tbody>
          </table></div>
          <p className="note">{r(t("To apply, <0>send us a message</0> with the role name and a link to your CV or LinkedIn. We welcome applications from people of every background, and we provide accommodations during hiring on request."), ["/contact?topic=careers"])}</p>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap">
          <h2>{t("How we work")}</h2>
          <div className="grid2">{VALUES.map((v) => <div key={v.t} className="box"><h3>{t(v.t)}</h3><p>{t(v.b)}</p></div>)}</div>
        </div>
      </section>
    </PageShell>
  );
}

export const pressMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/press", t("Press"), t("News, facts and media contacts for oenodPay."));
};

export function Press({ lang }: { lang: Locale }) {
  const { t, l } = ctx(lang);
  const facts = [["What", "All-in-one money app"], ["Made by", "OENOD"], ["First market", "Canada"], ["Platforms", "iPhone, Android, web"], ["Features", String(FEATURES.length)], ["Status", "Pre-launch, early access open"]];
  return (
    <PageShell lang={lang} path="/press" eyebrow={t("Press")} title={t("Press and media")} lead={t("Facts about oenodPay, and how to reach our team.")} crumbs={[{ href: "/press", t: t("Press") }]}
      actions={<Link href={l("/contact?topic=press")} className="btn light">{t("Media enquiries")}</Link>}>
      <section className="pg">
        <div className="wrap">
          <h2>{t("Fast facts")}</h2>
          <dl className="facts">{facts.map(([k, v]) => <div key={k}><dt>{t(k!)}</dt><dd>{t(v!)}</dd></div>)}</dl>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div><h2>{t("News")}</h2><div className="box"><span className="tag">{t("November 2026")}</span><h3>{t("oenodPay opens early access in Canada")}</h3><p>{t("People in Canada can now join the early-access list and try every feature with demo money on oenodpay.com.")}</p></div></div>
          <div><h2>{t("Brand")}</h2><div className="box"><h3>{t("Name")}</h3><p>{t("Write it as oenodPay: lowercase “oenod”, capital P. Our logo and media kit will be published here at launch.")}</p></div></div>
        </div>
      </section>
    </PageShell>
  );
}
