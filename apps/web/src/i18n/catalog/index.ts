import type { Locale } from "../index";
import fr from "./fr.json";
import es from "./es.json";
import pt from "./pt.json";
import ar from "./ar.json";
import hi from "./hi.json";
import ur from "./ur.json";
import tl from "./tl.json";
import zh from "./zh.json";

/** Translations keyed by hash of the English text. Generated from the .tsv files by scripts/i18n.ts. */
export const CATALOG: Partial<Record<Locale, Record<string, string>>> = { fr, es, pt, ar, hi, ur, tl, zh };
