// The page lives in src/views; this file only wires up the route.
import { notFound } from "next/navigation";
import { LegalDoc, docMeta, docParams } from "@/views/legal";
import { isLocale } from "@/i18n";

export const generateStaticParams = docParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const p = await params;
  return isLocale(p.lang) ? docMeta(p.lang, p.slug) : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const p = await params;
  if (!isLocale(p.lang) || p.lang === "en") notFound();
  return <LegalDoc lang={p.lang} slug={p.slug} />;
}
