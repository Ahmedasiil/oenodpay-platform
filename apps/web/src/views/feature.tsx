import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { FEATURES, FEATURE_ICON, featureBySlug } from "@/content/features";
import { IconChip } from "@/components/icon";
import { Calculator } from "@/components/calculator";
import { calcProps, ctx, pageMeta } from "@/i18n/server";
import { deepT } from "@/i18n/t";
import type { Locale } from "@/i18n";

export const params = () => FEATURES.map((f) => ({ slug: f.slug }));

export const meta = (lang: Locale, slug: string) => {
  const f = featureBySlug(slug);
  const { t } = ctx(lang);
  return f ? pageMeta(lang, `/features/${slug}`, t(f.name), t(f.tagline)) : {};
};

export default function Feature({ lang, slug }: { lang: Locale; slug: string }) {
  const src = featureBySlug(slug);
  if (!src) notFound();
  const { t, l } = ctx(lang);
  const f = deepT(src, t);
  const others = FEATURES.filter((o) => o.group === src.group && o.slug !== src.slug).map((o) => deepT(o, t));
  const path = `/features/${src.slug}`;
  return (
    <PageShell lang={lang} path={path} eyebrow={`${t(src.group)} · ${t(src.status)}`} title={f.name} lead={f.intro}
      crumbs={[{ href: "/features", t: t("Features") }, { href: path, t: f.name }]}
      actions={<><Link href={l("/#join")} className="btn light">{t("Get early access")}</Link><Link href={l("/#features")} className="btn line">{t("Try the demo")}</Link></>}
      aside={src.slug === "send-money-abroad" ? <Calculator {...calcProps(lang)} /> : (
        <div className="glass">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}><IconChip name={FEATURE_ICON[src.slug] ?? "check"} dark /><b style={{ fontSize: 17 }}>{f.name}</b></div>
          {f.facts.slice(0, 5).map((x) => <div key={x.k} className="gl-row"><span>{x.k}</span><b>{x.v}</b></div>)}
        </div>
      )}>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("How it works")}</span>
          <h2>{t("Set up in minutes")}</h2>
          <div className="steps">{f.steps.map((s) => <div key={s.t} className="box"><h3>{s.t}</h3><p>{s.b}</p></div>)}</div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap grid2" style={{ alignItems: "start", gap: 40 }}>
          <div><span className="eyebrow">{t("At a glance")}</span><h2>{t("Key facts")}</h2><dl className="facts">{f.facts.map((x) => <div key={x.k}><dt>{x.k}</dt><dd>{x.v}</dd></div>)}</dl></div>
          <div><span className="eyebrow">{t("Before you start")}</span><h2>{t("What you need")}</h2><ul className="checks">{f.needs.map((n) => <li key={n}>{n}</li>)}</ul></div>
        </div>
      </section>
      <section className="pg">
        <div className="wrap">
          <span className="eyebrow">{t("Questions")}</span>
          <h2>{t("What people ask")}</h2>
          <div className="faq2">{f.faq.map((q) => <details key={q.q}><summary>{q.q}</summary><p>{q.a}</p></details>)}</div>
          {f.legal && f.legal.length > 0 && (
            <p className="note" style={{ marginTop: 32 }}>{t("Read the full terms:")} {f.legal.map((x, i) => <span key={x.href}>{i ? ", " : ""}<Link href={l(x.href)}>{x.label}</Link></span>)}.</p>
          )}
        </div>
      </section>
      {others.length > 0 && (
        <section className="pg alt">
          <div className="wrap">
            <h2>{t("More in {group}", { group: t(src.group) })}</h2>
            <div className="grid3">{others.map((o) => <Link key={o.slug} href={l(`/features/${o.slug}`)} className="box"><IconChip name={FEATURE_ICON[o.slug] ?? "check"} /><h3>{o.name}</h3><p>{o.tagline}</p><span className="more">{t("Learn more →")}</span></Link>)}</div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
