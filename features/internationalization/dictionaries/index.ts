import { SupportedLocale, TranslationDictionary } from '../types';
import { en } from './en';
import { ur } from './ur';
import { ar } from './ar';
import { fr } from './fr';
import { es } from './es';

export const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  en,
  ur,
  ar,
  fr,
  es,
};

export function getDictionary(locale: SupportedLocale): TranslationDictionary {
  return dictionaries[locale] || dictionaries.en;
}

