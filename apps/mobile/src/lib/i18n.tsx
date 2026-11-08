import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { DICTS } from '@/i18n';
import { secureGet, secureSet } from '@/lib/secure-storage';

/**
 * App languages. Every visible string is written in English inside t('…') or m('…'),
 * and looked up in src/i18n/<lang>.ts. A missing translation falls back to English.
 * `npm run i18n:check` lists anything missing and checks the {placeholders} match.
 */
export const LANGS = [
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'es', name: 'Español' },
  { id: 'pt', name: 'Português' },
  { id: 'ar', name: 'العربية' },
  { id: 'hi', name: 'हिन्दी' },
  { id: 'ur', name: 'اردو' },
  { id: 'tl', name: 'Tagalog' },
  { id: 'zh', name: '中文' },
] as const;

export type Lang = (typeof LANGS)[number]['id'];
export type Vars = Record<string, string | number>;
export type T = (english: string, vars?: Vars) => string;

const RTL: readonly Lang[] = ['ar', 'ur'];
const STORE_KEY = 'oenodpay.lang';

/** Marks English text in module-level data so the checker finds it. Translate it with t() where it is shown. */
export const m = (english: string) => english;

function fill(s: string, vars?: Vars) {
  return vars ? s.replace(/\{(\w+)\}/g, (all, k: string) => (k in vars ? String(vars[k]) : all)) : s;
}

const isLang = (v: string | null | undefined): v is Lang => !!v && LANGS.some((l) => l.id === v);

function deviceLang(): Lang {
  try {
    const code = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0]?.toLowerCase();
    if (code === 'fil') return 'tl';
    return isLang(code) ? code : 'en';
  } catch {
    return 'en';
  }
}

interface Ctx { lang: Lang; rtl: boolean; t: T; setLang: (l: Lang) => void }

const english: T = (s, vars) => fill(s, vars);
const LangContext = createContext<Ctx>({ lang: 'en', rtl: false, t: english, setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(deviceLang);

  useEffect(() => {
    void secureGet(STORE_KEY).then((saved) => { if (isLang(saved)) setLangState(saved); }).catch(() => {});
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    void secureSet(STORE_KEY, l).catch(() => {});
  }, []);

  const value = useMemo<Ctx>(() => {
    const dict = lang === 'en' ? undefined : DICTS[lang];
    return { lang, rtl: RTL.includes(lang), setLang, t: (s, vars) => fill(dict?.[s] ?? s, vars) };
  }, [lang, setLang]);

  return (
    <LangContext.Provider value={value}>
      <View style={{ flex: 1, direction: value.rtl ? 'rtl' : 'ltr' }}>{children}</View>
    </LangContext.Provider>
  );
}

export const useT = () => useContext(LangContext).t;
export const useLang = () => useContext(LangContext);
