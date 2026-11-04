'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function CtaBanner() {
  const { t, dir } = useI18nStore();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <Container>
        <div className="relative rounded-3xl bg-slate-900 px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-xl overflow-hidden dark:bg-slate-900 border border-slate-800">
          {/* Subtle gradient lights */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs sm:text-sm font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>100% Free • Instant PDF Export</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {t.ctaBanner.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
              {t.ctaBanner.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/builder" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md hover:shadow-lg"
                >
                  <span>{t.ctaBanner.button}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/templates" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800"
                >
                  {t.ctaBanner.secondaryButton}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
