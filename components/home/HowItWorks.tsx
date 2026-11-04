'use client';

import React from 'react';
import { Layout, Edit3, Palette, FileDown } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';

export function HowItWorks() {
  const { t } = useI18nStore();

  const steps = [
    {
      icon: Layout,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
      stepNumber: '01',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200',
    },
    {
      icon: Edit3,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
      stepNumber: '02',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200',
    },
    {
      icon: Palette,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
      stepNumber: '03',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200',
    },
    {
      icon: FileDown,
      title: t.howItWorks.step4Title,
      description: t.howItWorks.step4Desc,
      stepNumber: '04',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/50 dark:bg-slate-950/50 border-y border-slate-200/60 dark:border-slate-800">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="secondary" className="px-3 py-1 font-semibold">
            {t.howItWorks.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.howItWorks.title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="relative flex flex-col p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl border ${step.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200 dark:text-slate-700 font-mono">
                    {step.stepNumber}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

