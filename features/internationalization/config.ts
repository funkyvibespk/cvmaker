import { LocaleConfig, SupportedLocale } from './types';

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    fontClass: 'font-sans',
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    dir: 'rtl',
    fontClass: 'font-urdu',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    fontClass: 'font-arabic',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    fontClass: 'font-sans',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    fontClass: 'font-sans',
  },
};

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export function isRtlLocale(locale: SupportedLocale): boolean {
  return SUPPORTED_LOCALES[locale]?.dir === 'rtl';
}

export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
  return SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES[DEFAULT_LOCALE];
}

