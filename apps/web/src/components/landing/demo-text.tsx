"use client";

import { createContext, useContext } from "react";

/**
 * Words for the "Try it now" demos. The page passes in a dictionary from English to the reader's
 * language (built on the server from the translation catalog), and demo code asks for words with
 * x() with the English text. Text in module-level data is marked with m() (from demo-state) and translated where it's shown.
 * `tsx scripts/i18n.ts demo` collects the text of every x() and m() call into demo-strings.gen.ts.
 */
export type X = (s: string, vars?: Record<string, string | number>) => string;

const fill = (s: string, vars?: Record<string, string | number>) =>
  vars ? s.replace(/\{(\w+)\}/g, (all, k: string) => (k in vars ? String(vars[k]) : all)) : s;

const Words = createContext<Record<string, string>>({});
export const DemoWords = Words.Provider;

export function useX(): X {
  const d = useContext(Words);
  return (s, vars) => fill(d[s] ?? s, vars);
}
