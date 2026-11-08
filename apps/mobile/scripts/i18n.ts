/**
 * Lists every English string the app shows (inside t('…') or m('…')) and checks each language file.
 *   npx tsx scripts/i18n.ts          check: fails if a translation is missing or its {placeholders} differ
 *   npx tsx scripts/i18n.ts missing  print what each language still needs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { DICTS } from '../src/i18n';

const SRC = join(__dirname, '..', 'src');
const RE = /\b[tm]\((?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return p.endsWith('i18n') ? [join(p, 'shared-strings.ts')] : files(p);
    return /\.tsx?$/.test(p) ? [p] : [];
  });
}

export function englishStrings(): string[] {
  const out = new Set<string>();
  for (const f of files(SRC)) {
    for (const mt of readFileSync(f, 'utf8').matchAll(RE)) out.add((mt[1] ?? mt[2]!).replace(/\\(.)/g, '$1'));
  }
  out.delete('…');
  return [...out].sort();
}

const holes = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((x) => x[1]).sort().join(',');

const strings = englishStrings();
let bad = 0;
for (const [lang, dict] of Object.entries(DICTS)) {
  const missing = strings.filter((s) => !(s in dict));
  const wrong = strings.filter((s) => s in dict && holes(s) !== holes(dict[s]!));
  const extra = Object.keys(dict).filter((k) => !strings.includes(k));
  console.log(`${lang}: ${strings.length - missing.length}/${strings.length}${wrong.length ? `, ${wrong.length} placeholder mismatches` : ''}${extra.length ? `, ${extra.length} unused` : ''}`);
  if (process.argv[2] === 'missing') missing.forEach((s) => console.log(`  ${s}`));
  wrong.forEach((s) => console.log(`  placeholders differ: ${s}`));
  bad += missing.length + wrong.length;
}
if (process.argv[2] !== 'missing' && bad) process.exit(1);
