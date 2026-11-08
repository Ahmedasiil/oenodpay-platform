import { LOCALES } from "@/i18n";

/** Every page under /fr, /es and so on is built ahead of time for each language. */
export const generateStaticParams = () => LOCALES.filter((l) => l.code !== "en").map((l) => ({ lang: l.code }));

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
