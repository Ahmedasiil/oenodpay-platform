import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Calculator } from "@/components/calculator";
import { COUNTRIES, LABEL, RECIPIENT_NEEDS, SENDER_NEEDS, countryBySlug } from "@/content/countries";
import { calcProps, ctx, pageMeta } from "@/i18n/server";
import type { Locale } from "@/i18n";

export const params = () => COUNTRIES.map((c) => ({ country: c.slug }));

export const meta = (lang: Locale, slug: string) => {
  const c = countryBySlug(slug);
  const { t } = ctx(lang);
  if (!c) return {};
  const country = t(c.countryName);
  return pageMeta(lang, `/send-money/${slug}`, t("Send money to {country} from Canada", { country }), t("Fees, delivery times and requirements for sending money to {country}.", { country }));
};

const cad = (m: number) => `$${(m / 100).toFixed(2)}`;

export default function Country({ lang, slug }: { lang: Locale; slug: string }) {
  const c = countryBySlug(slug);
  if (!c) notFound();
  const { t, l } = ctx(lang);
  const country = t(c.countryName);
  const types = [...new Set(c.methods.map((m) => m.type))];
  const path = `/send-money/${c.slug}`;
  return (
    <PageShell lang={lang} path={path} eyebrow={`${t("Send money")} · ${c.currency}`} title={t("Send money to {country}", { country })}
      lead={t("Send Canadian dollars and your recipient gets {currency}. The most popular way is: {method}.", { currency: c.currency, method: t(c.popular) })}
      crumbs={[{ href: "/send-money", t: t("Send money") }, { href: path, t: country }]}
      actions={<Link href={l("/#join")} className="btn light">{t("Get early access")}</Link>}
      aside={<Calculator {...calcProps(lang)} country={c.countryCode} />}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("Fees and speed")}</span>
          <h2>{t("Ways to send and fees")}</h2>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>{t("How it arrives")}</th><th>{t("Type")}</th><th>{t("Usually arrives")}</th><th>{t("Fee")}</th></tr></thead>
              <tbody>{c.methods.map((m) => <tr key={m.id}><td>{t(m.name)}</td><td>{t(LABEL[m.type])}</td><td>{t(m.eta)}</td><td>{cad(m.feeMinor)}</td></tr>)}</tbody>
            </table>
          </div>
          <dl className="facts">
            <div><dt>{t("Currency received")}</dt><dd>{c.currency}</dd></div>
            <div><dt>{t("Example rate")}</dt><dd className="num" dir="ltr">1 CAD ≈ {c.sampleRate} {c.currency}</dd></div>
            <div><dt>{t("Per transfer (new accounts)")}</dt><dd>{t("Up to $3,000")}</dd></div>
            <div><dt>{t("Rate shown")}</dt><dd>{t("Before you pay, locked for 30 min")}</dd></div>
          </dl>
          <p className="note" style={{ marginTop: 20 }}>{t("The rate above is an example only. You see the live rate and the exact amount your recipient gets before you confirm.")}</p>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div>
            <h2>{t("What your recipient needs")}</h2>
            {types.map((k) => <div key={k} style={{ marginBottom: 20 }}><h3>{t(LABEL[k])}</h3><ul className="checks">{RECIPIENT_NEEDS[k].map((n) => <li key={n}>{t(n)}</li>)}</ul></div>)}
            <h3>{t("Good to know about {country}", { country })}</h3>
            <ul className="checks">{c.notes.map((n) => <li key={n}>{t(n)}</li>)}</ul>
          </div>
          <div>
            <h2>{t("What you need")}</h2>
            <ul className="checks">{SENDER_NEEDS.map((n) => <li key={n}>{t(n)}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <h2>{t("Other countries")}</h2>
          <div className="grid3">{COUNTRIES.filter((o) => o.slug !== c.slug).map((o) => <Link key={o.slug} href={l(`/send-money/${o.slug}`)} className="box"><h3>{t(o.countryName)}</h3><p>{o.methods.map((m) => t(m.name)).join(" · ")}</p></Link>)}</div>
        </div>
      </section>
    </PageShell>
  );
}
