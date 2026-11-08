// The page lives in src/views; this file only wires up the route.
import { notFound } from "next/navigation";
import View, { meta, params } from "@/views/feature";
import { isLocale } from "@/i18n";

export const generateStaticParams = params;
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const p = await params;
  return isLocale(p.lang) ? meta(p.lang, p.slug) : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const p = await params;
  if (!isLocale(p.lang) || p.lang === "en") notFound();
  return <View lang={p.lang} slug={p.slug} />;
}
