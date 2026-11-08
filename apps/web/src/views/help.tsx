import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { HELP } from "@/content/help";
import { ctx, pageMeta } from "@/i18n/server";
import { deepT } from "@/i18n/t";
import type { Locale } from "@/i18n";

const PATH = "/help";

export const meta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, PATH, t("Help centre"), t("Answers about accounts, identity verification, sending money, your card, security and fees."));
};

export default function Help({ lang }: { lang: Locale }) {
  const { t, l } = ctx(lang);
  const help = deepT(HELP, t);
  return (
    <PageShell lang={lang} path={PATH} eyebrow={t("Support")} title={t("How can we help?")} lead={t("Answers to the questions people ask most. Can't find yours? Contact us and a person will reply.")} crumbs={[{ href: PATH, t: t("Help centre") }]}
      actions={<Link href={l("/contact")} className="btn light">{t("Contact us")}</Link>}>
      <section className="pg">
        <div className="wrap">
          <div className="grid3">
            {help.map((x) => (
              <Link key={x.slug} href={l(`/help/${x.slug}`)} className="box">
                <h3>{x.title}</h3><p>{x.blurb}</p>
                <p style={{ fontSize: 14 }}>{t("{n} articles", { n: x.articles.length })}</p>
                <span className="more">{t("Browse →")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="pg alt">
        <div className="wrap">
          <h2>{t("Popular questions")}</h2>
          <div className="faq2">{help.map((x) => x.articles[0]!).map((a) => <details key={a.q}><summary>{a.q}</summary>{a.a.map((p, i) => <p key={i}>{p}</p>)}</details>)}</div>
        </div>
      </section>
    </PageShell>
  );
}

export const topicParams = () => HELP.map((x) => ({ topic: x.slug }));

export const topicMeta = (lang: Locale, slug: string) => {
  const x = HELP.find((h) => h.slug === slug);
  const { t } = ctx(lang);
  return x ? pageMeta(lang, `/help/${slug}`, t("{topic} · Help", { topic: t(x.title) }), t(x.blurb)) : {};
};

export function HelpTopic({ lang, slug }: { lang: Locale; slug: string }) {
  const src = HELP.find((h) => h.slug === slug);
  if (!src) notFound();
  const { t, l, r } = ctx(lang);
  const x = deepT(src, t);
  const path = `/help/${x.slug}`;
  return (
    <PageShell lang={lang} path={path} eyebrow={t("Help centre")} title={x.title} lead={x.blurb} crumbs={[{ href: PATH, t: t("Help centre") }, { href: path, t: x.title }]}>
      <section className="pg">
        <div className="wrap side">
          <nav className="toc" aria-label={t("Help topics")}>
            <span className="mm-h">{t("Topics")}</span>
            {HELP.map((o) => <Link key={o.slug} href={l(`/help/${o.slug}`)} aria-current={o.slug === x.slug ? "page" : undefined}>{t(o.title)}</Link>)}
          </nav>
          <div>
            <div className="faq2">{x.articles.map((a) => <details key={a.q} open><summary>{a.q}</summary>{a.a.map((p, i) => <p key={i}>{p}</p>)}</details>)}</div>
            <p className="note" style={{ marginTop: 32 }}>{r(t("Still need help? <0>Contact us</0>. We reply within one business day."), ["/contact"])}</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
