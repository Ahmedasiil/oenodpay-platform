// The page lives in src/views; this file only wires up the route.
import { notFound } from "next/navigation";
import { HelpTopic, topicMeta, topicParams } from "@/views/help";
import { isLocale } from "@/i18n";

export const generateStaticParams = topicParams;
export async function generateMetadata({ params }: { params: Promise<{ lang: string; topic: string }> }) {
  const p = await params;
  return isLocale(p.lang) ? topicMeta(p.lang, p.topic) : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string; topic: string }> }) {
  const p = await params;
  if (!isLocale(p.lang) || p.lang === "en") notFound();
  return <HelpTopic lang={p.lang} slug={p.topic} />;
}
