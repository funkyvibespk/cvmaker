import { create } from 'zustand';
import { SupportedLocale, Direction, TranslationDictionary } from './types';
import { DEFAULT_LOCALE, getLocaleConfig, isRtlLocale } from './config';
import { getDictionary } from './dictionaries';

interface I18nState {
  locale: SupportedLocale;
  resumeLocale: SupportedLocale;
  dir: Direction;
  t: TranslationDictionary;
  setLocale: (locale: SupportedLocale) => void;
  setResumeLocale: (locale: SupportedLocale) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: DEFAULT_LOCALE,
  resumeLocale: DEFAULT_LOCALE,
  dir: 'ltr',
  t: getDictionary(DEFAULT_LOCALE),
  setLocale: (locale: SupportedLocale) => {
    const dir: Direction = isRtlLocale(locale) ? 'rtl' : 'ltr';
    const config = getLocaleConfig(locale);
    
    // Safely apply attributes in browser environment
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
      // Remove previous font classes
      document.documentElement.classList.remove('font-sans', 'font-arabic', 'font-urdu');
      document.documentElement.classList.add(config.fontClass);
    }

    set({
      locale,
      dir,
      t: getDictionary(locale),
    });
  },
  setResumeLocale: (resumeLocale: SupportedLocale) => {
    set({ resumeLocale });
  },
}));

