'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Construction, Sparkles } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';

export default function BuilderPage() {
  const { t, dir } = useI18nStore();
  const ArrowIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <div className="py-20">
      <Container size="sm" className="text-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-10 sm:p-14 shadow-lg dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <Badge variant="accent" className="px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Milestone In Progress</span>
          </Badge>

          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Construction className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Resume Builder Workspace
          </h1>

          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            The universal resume data model, interactive dynamic forms, and live preview engine will be introduced in the upcoming milestones.
          </p>

          <div className="pt-4">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowIcon className="h-4 w-4" />
                <span>Return to Homepage</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

