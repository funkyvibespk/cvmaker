'use client';

import React from 'react';
import { UserCheck, ShieldCheck, FileCheck, Eye, Globe2, Printer } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';

export function FeaturesGrid() {
  const { t } = useI18nStore();

  const features = [
    {
      icon: UserCheck,
      title: t.features.f1Title,
      description: t.features.f1Desc,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      icon: ShieldCheck,
      title: t.features.f2Title,
      description: t.features.f2Desc,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      icon: FileCheck,
      title: t.features.f3Title,
      description: t.features.f3Desc,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      icon: Eye,
      title: t.features.f4Title,
      description: t.features.f4Desc,
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      icon: Globe2,
      title: t.features.f5Title,
      description: t.features.f5Desc,
      iconColor: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    },
    {
      icon: Printer,
      title: t.features.f6Title,
      description: t.features.f6Desc,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50/60 dark:bg-slate-950/60 border-t border-slate-200/60 dark:border-slate-800">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="secondary" className="px-3 py-1 font-semibold">
            {t.features.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.features.title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.bgColor}`}>
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

