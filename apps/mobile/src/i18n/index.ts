import ar from './ar';
import es from './es';
import fr from './fr';
import hi from './hi';
import pt from './pt';
import tl from './tl';
import ur from './ur';
import zh from './zh';

/** English text → translation, per language. English itself needs no file. */
export const DICTS: Record<'fr' | 'es' | 'pt' | 'ar' | 'hi' | 'ur' | 'tl' | 'zh', Record<string, string>> = { fr, es, pt, ar, hi, ur, tl, zh };
