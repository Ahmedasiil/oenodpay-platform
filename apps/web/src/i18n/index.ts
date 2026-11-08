import type { Dict } from "./types";
import { en } from "./en";
import { fr } from "./fr";
import { es } from "./es";
import { pt } from "./pt";
import { ar } from "./ar";
import { hi } from "./hi";
import { ur } from "./ur";
import { tl } from "./tl";
import { zh } from "./zh";

export type { Dict };

export const LOCALES = [
  { code: "en", name: "English", dir: "ltr", hreflang: "en-CA" },
  { code: "fr", name: "Français", dir: "ltr", hreflang: "fr-CA" },
  { code: "es", name: "Español", dir: "ltr", hreflang: "es" },
  { code: "pt", name: "Português", dir: "ltr", hreflang: "pt" },
  { code: "ar", name: "العربية", dir: "rtl", hreflang: "ar" },
  { code: "hi", name: "हिन्दी", dir: "ltr", hreflang: "hi" },
  { code: "ur", name: "اردو", dir: "rtl", hreflang: "ur" },
  { code: "tl", name: "Tagalog", dir: "ltr", hreflang: "tl" },
  { code: "zh", name: "中文", dir: "ltr", hreflang: "zh-Hans" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];
export const DICTS: Record<Locale, Dict> = { en, fr, es, pt, ar, hi, ur, tl, zh };
export const isLocale = (s: string | undefined): s is Locale => !!s && s in DICTS;
export const localeInfo = (l: Locale) => LOCALES.find((x) => x.code === l)!;
/** Home page address for a language: English lives at /, the others at /fr, /es and so on. */
export const homeHref = (l: Locale) => (l === "en" ? "/" : `/${l}`);
