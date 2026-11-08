import Link from "next/link";
import type { Metadata } from "next";
import { Fragment } from "react";
import { DICTS, LOCALES, type Locale } from "./index";
import { CORRIDORS } from "@oenodpay/shared";
import { L, getT, type T } from "./t";

/**
 * A translated sentence with links inside it. The text marks each link with numbered tags,
 * like "Read the <0>account agreement</0>.", so translators can move the link with the words.
 */
export function rich(text: string, hrefs: string[], lang: Locale): React.ReactNode {
  const parts = text.split(/(<\d+>.*?<\/\d+>)/g);
  return parts.map((p, i) => {
    const m = /^<(\d+)>(.*?)<\/\d+>$/.exec(p);
    if (!m) return <Fragment key={i}>{p}</Fragment>;
    const href = hrefs[Number(m[1])] ?? "/";
    return <Link key={i} href={L(lang, href)}>{m[2]}</Link>;
  });
}

/** Title, description and the hreflang links that tell search engines about every language. */
export function pageMeta(lang: Locale, path: string, title: string, description: string): Metadata {
  return {
    title: `${title} | oenodPay`,
    description,
    alternates: {
      canonical: L(lang, path),
      languages: Object.fromEntries(LOCALES.map((l) => [l.hreflang, L(l.code, path)])),
    },
    openGraph: { title: `${title} | oenodPay`, description, locale: lang },
  };
}

/** Everything a page view needs to render in a language. */
export function ctx(lang: Locale) {
  const t: T = getT(lang);
  return { t, d: DICTS[lang], l: (p: string) => L(lang, p), r: (s: string, hrefs: string[]) => rich(s, hrefs, lang) };
}

/** Props for the price calculator in a language: its labels plus translated country, method and timing names. */
export function calcProps(lang: Locale) {
  const t = getT(lang);
  const names: Record<string, string> = {};
  const add = (s: string) => { const x = t(s); if (x !== s) names[s] = x; };
  ["Amount in Canadian dollars", "Destination country", "How they receive it"].forEach(add);
  for (const c of CORRIDORS) { add(c.countryName); for (const m of c.methods) { add(m.name); add(m.eta); } }
  return { t: DICTS[lang].calc, joinHref: L(lang, "/#join"), names };
}
