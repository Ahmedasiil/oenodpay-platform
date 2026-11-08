import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { DICTS, LOCALES, isLocale } from "@/i18n";

export const generateStaticParams = () => LOCALES.filter((l) => l.code !== "en").map((l) => ({ lang: l.code }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = DICTS[lang];
  return {
    title: `oenodPay: ${t.hero.h1a} ${t.hero.h1b}`,
    description: t.hero.lead,
    alternates: { canonical: `/${lang}`, languages: Object.fromEntries(LOCALES.map((l) => [l.hreflang, l.code === "en" ? "/" : `/${l.code}`])) },
    openGraph: { title: `oenodPay: ${t.hero.h1a} ${t.hero.h1b}`, description: t.hero.lead, locale: lang },
  };
}

export default async function LocalizedHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "en") notFound();
  return <HomePage lang={lang} />;
}
