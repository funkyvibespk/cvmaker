'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft, Shield, CheckCircle, Zap, Download } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';

export function Hero() {
  const { t, dir } = useI18nStore();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-50/60 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Background blur accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-100/40 via-indigo-50/20 to-transparent blur-3xl -z-10 dark:from-blue-950/20 dark:via-indigo-950/10 pointer-events-none" />

      <Container>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill */}
          <Badge variant="accent" className="px-3.5 py-1 text-xs sm:text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.hero.badge}</span>
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            <span>{t.hero.titleStart} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 dark:from-blue-400 dark:to-indigo-300">
              {t.hero.titleHighlight}
            </span>{' '}
            <span>{t.hero.titleEnd}</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {t.hero.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full pt-2">
            <Link href="/builder" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base shadow-md hover:shadow-lg font-semibold">
                <span>{t.hero.ctaPrimary}</span>
                <ArrowIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                {t.hero.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Trust Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 w-full max-w-3xl border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{t.hero.trustNoAccount}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Download className="h-4 w-4 text-blue-600 shrink-0" />
              <span>{t.hero.trustFreeForever}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>{t.hero.trustPrivate}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-amber-500 shrink-0" />
              <span>{t.hero.trustAts}</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Mock Showcase */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900/80 ring-1 ring-slate-900/5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950/60">
            {/* Mock Editor + Live Preview Simulation Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ms-2 font-mono text-[11px] text-slate-400">cvmaker-studio // live-render</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>In-Memory Volatile Session</span>
              </div>
            </div>

            {/* Split Preview Mock */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5">
              {/* Form Side Mock */}
              <div className="md:col-span-5 space-y-3 hidden sm:block">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-7 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/70 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-12 bg-blue-100 rounded" />
                  </div>
                  <div className="h-8 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>

              {/* Simulated Paper Side */}
              <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 shadow-md p-6 space-y-4">
                <div className="border-b border-slate-200/80 pb-3 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Alexander Vance</h3>
                    <p className="text-xs text-blue-600 font-semibold tracking-wide uppercase">Principal Software Architect</p>
                  </div>
                  <div className="text-[10px] text-slate-400 text-end">
                    <span>San Francisco, CA</span> • <span>alexander@example.com</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-16 bg-slate-300 dark:bg-slate-600 rounded" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Senior engineering leader with 10+ years specializing in distributed systems, modern web architectures, and mission-critical cloud infrastructure.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-24 bg-slate-300 dark:bg-slate-600 rounded" />
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span>Staff Cloud Architect — Enterprise Cloud Solutions</span>
                      <span className="text-slate-400">2021 — Present</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Led architectural redesign improving throughput by 42% and reducing latency across global edge points.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
