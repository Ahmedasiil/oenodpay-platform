import type { Locale } from "./index";
import { CATALOG } from "./catalog";

/**
 * Page translations. Pages keep their English text in the code and wrap it in t("…").
 * Each language has a catalog keyed by a short hash of the English text, so a missing
 * translation falls back to English instead of breaking the page, and changing the English
 * text shows up as "needs translation" in `pnpm i18n:check`.
 */
export function hash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export type T = (s: string, vars?: Record<string, string | number>) => string;

const fill = (s: string, vars?: Record<string, string | number>) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;

/** With I18N_RECORD=<file>, every English string a page asks for is written down during the build. */
const RECORD = typeof window === "undefined" ? process.env.I18N_RECORD : undefined;
const seen = new Set<string>();
function record(s: string) {
  if (!RECORD || seen.has(s)) return;
  seen.add(s);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  (require("node:fs") as typeof import("node:fs")).appendFileSync(RECORD, JSON.stringify(s) + "\n");
}

export function getT(lang: Locale): T {
  const m = lang === "en" ? undefined : CATALOG[lang];
  return (s, vars) => {
    record(s);
    return fill((m && m[hash(s)]) || s, vars);
  };
}

/** Keys whose values are identifiers, links or numbers-as-codes, never shown as words. */
const SKIP = new Set(["slug", "href", "status", "group", "code", "icon", "id", "currency", "flag", "dial", "email", "url", "kind"]);

/** Translate every visible string inside a content object (features, countries, help topics…). */
export function deepT<V>(v: V, t: T): V {
  if (typeof v === "string") return t(v) as V;
  if (Array.isArray(v)) return v.map((x) => deepT(x, t)) as V;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = SKIP.has(k) ? x : deepT(x, t);
    return out as V;
  }
  return v;
}

/** The address of a page in a language: /pricing in English, /fr/pricing in French. */
export function L(lang: Locale, path: string): string {
  if (lang === "en" || /^(https?:|mailto:|tel:)/.test(path)) return path;
  if (path === "/") return `/${lang}`;
  if (path.startsWith("/#")) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path}`;
}
