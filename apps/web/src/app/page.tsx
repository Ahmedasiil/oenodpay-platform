import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { LOCALES } from "@/i18n";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: Object.fromEntries(LOCALES.map((l) => [l.hreflang, l.code === "en" ? "/" : `/${l.code}`])) },
};

export default function Home() {
  return <HomePage lang="en" />;
}
