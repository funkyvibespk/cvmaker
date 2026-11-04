'use client';

import React, { useEffect } from 'react';
import { useI18nStore } from './store';
import { getLocaleConfig } from './config';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useI18nStore();

  useEffect(() => {
    const config = getLocaleConfig(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.classList.remove('font-sans', 'font-arabic', 'font-urdu');
    document.documentElement.classList.add(config.fontClass);
  }, [locale, dir]);

  return <div dir={dir} className="min-h-screen flex flex-col">{children}</div>;
}

