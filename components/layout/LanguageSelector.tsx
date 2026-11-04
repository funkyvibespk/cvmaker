'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { SUPPORTED_LOCALES } from '@/features/internationalization/config';
import { SupportedLocale } from '@/features/internationalization/types';
import { cn } from '@/lib/utils';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, t, dir } = useI18nStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = SUPPORTED_LOCALES[locale];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode: SupportedLocale) => {
    setLocale(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4 text-slate-500" />
        <span className="font-semibold">{currentConfig.nativeName}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute mt-1.5 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 z-50 dark:border-slate-800 dark:bg-slate-900',
            dir === 'rtl' ? 'left-0' : 'right-0'
          )}
          role="menu"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t.nav.selectLanguage}
          </div>
          {(Object.keys(SUPPORTED_LOCALES) as SupportedLocale[]).map((langCode) => {
            const item = SUPPORTED_LOCALES[langCode];
            const isSelected = locale === langCode;

            return (
              <button
                key={langCode}
                type="button"
                onClick={() => handleSelect(langCode)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-sm transition-colors text-start hover:bg-slate-100 dark:hover:bg-slate-800',
                  isSelected
                    ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                    : 'text-slate-700 dark:text-slate-200'
                )}
                role="menuitem"
              >
                <div className="flex flex-col">
                  <span>{item.nativeName}</span>
                  <span className="text-[11px] text-slate-400">{item.name}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

