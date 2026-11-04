'use client';

import React, { useEffect } from 'react';
import { useI18nStore } from './store';
import { getLocaleConfig, SUPPORTED_LOCALES } from './config';
import { SupportedLocale } from './types';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir, setLocale } = useI18nStore();

  // Restore persisted language preference upon initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cvmaker_locale') as SupportedLocale;
      if (saved && SUPPORTED_LOCALES[saved] && saved !== locale) {
        setLocale(saved);
      }
    } catch {
      // Storage unavailable
    }
  }, [locale, setLocale]);

  // Synchronize document attributes and font class
  useEffect(() => {
    const config = getLocaleConfig(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.classList.remove('font-sans', 'font-arabic', 'font-urdu');
    document.documentElement.classList.add(config.fontClass);
  }, [locale, dir]);

  return <div dir={dir} className="min-h-screen flex flex-col">{children}</div>;
}
