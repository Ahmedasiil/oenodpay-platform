import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { LEGAL, LEGAL_GROUPS, legalBySlug } from "@/content/legal";
import { ctx, pageMeta } from "@/i18n/server";
import { getT } from "@/i18n/t";
import type { Locale } from "@/i18n";

/**
 * Legal documents. Titles and summaries are translated into every language. The full text is
 * in English and French (French is required for consumer contracts in Quebec); other languages
 * show the English text with a notice, until counsel-approved translations exist.
 */
export const FULL_TEXT: Locale[] = ["en", "fr"];

export const legalMeta = (lang: Locale) => {
  const { t } = ctx(lang);
  return pageMeta(lang, "/legal", t("Legal"), t("Every oenodPay agreement, policy and disclosure in one place."));
};

export function Legal({ lang }: { lang: Locale }) {
  const { t, l } = ctx(lang);
  return (
    <PageShell lang={lang} path="/legal" eyebrow={t("Legal")} title={t("Agreements and policies")} lead={t("Every agreement, policy and disclosure that applies to oenodPay, written in plain language.")} crumbs={[{ href: "/legal", t: t("Legal") }]}>
      <section className="pg">
        <div className="wrap">
          <p className="note warn" style={{ marginBottom: 40 }}>{t("These documents are drafts prepared before launch. They will be reviewed by legal counsel and finalized before oenodPay opens accounts. They don't create any obligations yet.")}</p>
          {!FULL_TEXT.includes(lang) && <p className="note" style={{ marginBottom: 40 }}>{t("The full text of these documents is available in English and French. Titles and summaries are translated to help you find what you need.")}</p>}
          {LEGAL_GROUPS.map((g) => (
            <div key={g} style={{ marginBottom: 44 }}>
              <h2>{t(g)}</h2>
              <div className="grid3">
                {LEGAL.filter((d) => d.group === g).map((d) => (
                  <Link key={d.slug} href={l(`/legal/${d.slug}`)} className="box"><h3>{t(d.title)}</h3><p>{t(d.summary)}</p><span className="more">{t("Read →")}</span></Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export const docParams = () => LEGAL.map((d) => ({ slug: d.slug }));

export const docMeta = (lang: Locale, slug: string) => {
  const d = legalBySlug(slug);
  const { t } = ctx(lang);
  return d ? pageMeta(lang, `/legal/${slug}`, t(d.title), t(d.summary)) : {};
};

const id = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function LegalDoc({ lang, slug }: { lang: Locale; slug: string }) {
  const d = legalBySlug(slug);
  if (!d) notFound();
  const { t, l, r } = ctx(lang);
  const full = FULL_TEXT.includes(lang);
  // The body is translated only where a full translation exists; anchors stay on the English headings.
  const b = full ? t : getT("en");
  const path = `/legal/${d.slug}`;
  return (
    <PageShell lang={lang} path={path} eyebrow={`${t("Legal")} · ${t(d.group)}`} title={t(d.title)} lead={t(d.summary)} crumbs={[{ href: "/legal", t: t("Legal") }, { href: path, t: t(d.title) }]}>
      <section className="pg alt">
        <div className="wrap side">
          <nav className="toc" aria-label={t("On this page")}>
            <span className="mm-h">{t("On this page")}</span>
            {d.sections.map((s) => <a key={s.h} href={`#${id(s.h)}`} lang={full ? undefined : "en"}>{b(s.h)}</a>)}
            <span className="mm-h" style={{ marginTop: 16 }}>{t("Related")}</span>
            {LEGAL.filter((o) => o.group === d.group && o.slug !== d.slug).map((o) => <Link key={o.slug} href={l(`/legal/${o.slug}`)}>{t(o.title)}</Link>)}
          </nav>
          <article className="prose" lang={full ? undefined : "en"} dir={full ? undefined : "ltr"}>
            {!full && <p className="note" style={{ marginBottom: 20 }} lang={lang} dir="auto">{r(t("This document is available in English and French. The English version is shown below. <0>Contact us</0> if you need help understanding it."), ["/contact"])}</p>}
            <p className="note warn" style={{ marginBottom: 28 }}>{b("Draft for counsel review. This document will be finalized before oenodPay opens accounts. Last updated November 2026.")}</p>
            {d.sections.map((s) => (
              <section key={s.h}>
                <h2 id={id(s.h)}>{b(s.h)}</h2>
                {s.p.map((p, i) => <p key={i}>{b(p)}</p>)}
              </section>
            ))}
            <p style={{ marginTop: 32 }}><Link href={l("/legal")}>{b("← All agreements and policies")}</Link></p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}

export function NotFoundView({ lang }: { lang: Locale }) {
  const { t, l } = ctx(lang);
  return (
    <PageShell lang={lang} eyebrow={t("Error 404")} title={t("We couldn't find")} accent={t("that page.")} lead={t("It may have moved, or the link may be wrong. These are good places to start.")} cta={false}
      actions={<><Link href={l("/")} className="btn light">{t("Go home")}</Link><Link href={l("/help")} className="btn line">{t("Help centre")}</Link></>}>
      <section className="pg"><div className="wrap grid3">
        <Link href={l("/features")} className="box"><h3>{t("Features")}</h3><p>{t("Everything oenodPay does.")}</p></Link>
        <Link href={l("/send-money")} className="box"><h3>{t("Send money")}</h3><p>{t("Countries, fees and requirements.")}</p></Link>
        <Link href={l("/contact")} className="box"><h3>{t("Contact us")}</h3><p>{t("A real person will reply.")}</p></Link>
      </div></section>
    </PageShell>
  );
}
