/**
 * Website translation helper.
 *
 *   pnpm i18n:record   build the site and write down every English string the pages use
 *   pnpm i18n:check    list what each language is still missing (and compile the catalogs)
 *
 * Translations live in src/i18n/catalog/<lang>.tsv, one "hash<TAB>translation" per line, where the
 * hash is of the English text (see src/i18n/t.ts). The English text for each hash is in source.tsv.
 * Legal document bodies only need translating into French (see FULL_TEXT in src/views/legal.tsx).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { hash } from "../src/i18n/t";
import { LEGAL } from "../src/content/legal";

const DIR = join(__dirname, "../src/i18n/catalog");
const LANGS = ["fr", "es", "pt", "ar", "hi", "ur", "tl", "zh"];
const FULL_LEGAL = new Set(["fr"]);

const legalBody = new Set<string>();
for (const d of LEGAL) for (const s of d.sections) { legalBody.add(s.h); s.p.forEach((p) => legalBody.add(p)); }
legalBody.add("Draft for counsel review. This document will be finalized before oenodPay opens accounts. Last updated November 2026.");
legalBody.add("← All agreements and policies");

const cmd = process.argv[2];

if (cmd === "source") {
  const file = process.argv[3]!;
  const strings = [...new Set(readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l) as string))]
    .filter((s) => /[A-Za-z]/.test(s) && s !== "oenodPay");
  const lines = strings.map((s) => `${hash(s)}\t${legalBody.has(s) ? "legal" : "page"}\t${s.replace(/\n/g, "\\n")}`);
  writeFileSync(join(DIR, "source.tsv"), lines.join("\n") + "\n");
  console.log(`${strings.length} strings (${strings.filter((s) => legalBody.has(s)).length} in legal documents)`);
}

if (cmd === "check" || cmd === "source") {
  const source = readFileSync(join(DIR, "source.tsv"), "utf8").trim().split("\n").map((l) => l.split("\t") as [string, string, string]);
  const tags = (s: string) => [...s.matchAll(/\{\w+\}|<\/?\d+>/g)].map((m) => m[0]).sort().join(" ");
  let bad = 0;
  for (const lang of LANGS) {
    const tsv = join(DIR, `${lang}.tsv`);
    const map: Record<string, string> = {};
    if (existsSync(tsv)) {
      for (const line of readFileSync(tsv, "utf8").split("\n")) {
        const i = line.indexOf("\t");
        if (i > 0) map[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/\\n/g, "\n");
      }
    }
    const en = new Map(source.map(([h, , s]) => [h, s]));
    for (const [h, tr] of Object.entries(map)) {
      const e = en.get(h);
      if (e === undefined) { delete map[h]; continue; }
      if (tags(e) !== tags(tr)) { console.log(`  ${lang} ${h}: placeholders differ\n    en: ${e}\n    ${lang}: ${tr}`); bad++; }
    }
    writeFileSync(join(DIR, `${lang}.json`), JSON.stringify(map, null, 0) + "\n");
    const need = source.filter(([h, kind]) => !map[h] && (kind === "page" || FULL_LEGAL.has(lang)));
    writeFileSync(join(DIR, `missing-${lang}.tsv`), need.map((x) => `${x[0]}\t${x[2]}`).join("\n") + (need.length ? "\n" : ""));
    console.log(`${lang}: ${Object.keys(map).length} translated, ${need.length} missing`);
  }
  if (bad) { console.log(`${bad} translations have different placeholders or links`); process.exitCode = 1; }
}
