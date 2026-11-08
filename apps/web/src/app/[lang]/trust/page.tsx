// The page lives in src/views; this file only wires up the route.
import { notFound } from "next/navigation";
import { Trust, trustMeta } from "@/views/trust";
import { isLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLocale(lang) ? trustMeta(lang) : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "en") notFound();
  return <Trust lang={lang} />;
}
