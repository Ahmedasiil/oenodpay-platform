// The page lives in src/views; this file only wires up the route.
import { notFound } from "next/navigation";
import { Careers, careersMeta } from "@/views/company";
import { isLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLocale(lang) ? careersMeta(lang) : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "en") notFound();
  return <Careers lang={lang} />;
}
