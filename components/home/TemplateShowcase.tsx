'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface TemplateItem {
  id: string;
  name: string;
  category: 'ats' | 'modern' | 'professional' | 'creative';
  categoryLabel: string;
  description: string;
  atsScore: string;
  accentColor: string;
  layoutType: 'single-column' | 'two-column' | 'sidebar' | 'compact';
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'ats-classic',
    name: 'ATS Classic Clean',
    category: 'ats',
    categoryLabel: 'ATS-Friendly',
    description: 'High-parsing single-column layout strictly adhering to global recruiter and algorithm standards.',
    atsScore: '99% ATS Score',
    accentColor: '#1E293B',
    layoutType: 'single-column',
  },
  {
    id: 'executive-modern',
    name: 'Executive Modern',
    category: 'modern',
    categoryLabel: 'Modern',
    description: 'Balanced typographic hierarchy with subtle divider accents, ideal for mid and senior specialists.',
    atsScore: '97% ATS Score',
    accentColor: '#1E3A8A',
    layoutType: 'single-column',
  },
  {
    id: 'corporate-slate',
    name: 'Corporate Premier',
    category: 'professional',
    categoryLabel: 'Corporate',
    description: 'Sophisticated header block with streamlined experience timelines for management professionals.',
    atsScore: '96% ATS Score',
    accentColor: '#334155',
    layoutType: 'two-column',
  },
  {
    id: 'tech-minimalist',
    name: 'Tech Minimalist',
    category: 'modern',
    categoryLabel: 'Minimal',
    description: 'Dense, clean skills presentation and project focus engineered specifically for developers & engineers.',
    atsScore: '98% ATS Score',
    accentColor: '#065F46',
    layoutType: 'single-column',
  },
  {
    id: 'creative-sidebar',
    name: 'Creative Studio',
    category: 'creative',
    categoryLabel: 'Creative',
    description: 'Left accent column highlighting profile summary, competencies, and language proficiencies.',
    atsScore: '94% ATS Score',
    accentColor: '#831843',
    layoutType: 'sidebar',
  },
  {
    id: 'academic-compact',
    name: 'Academic & Research',
    category: 'professional',
    categoryLabel: 'Academic',
    description: 'Structured publication, certification, and pedagogical research format for scholars and educators.',
    atsScore: '98% ATS Score',
    accentColor: '#1D4ED8',
    layoutType: 'compact',
  },
];

export function TemplateShowcase() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ats' | 'modern' | 'professional' | 'creative'>('all');
  const { t, dir } = useI18nStore();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const filteredTemplates = activeFilter === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((tpl) => tpl.category === activeFilter);

  return (
    <section id="templates" className="py-20 bg-white dark:bg-slate-900">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <Badge variant="accent" className="px-3 py-1 font-semibold">
            {t.templates.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.templates.title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.templates.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: t.templates.filterAll },
            { id: 'ats', label: t.templates.filterAts },
            { id: 'modern', label: t.templates.filterModern },
            { id: 'professional', label: t.templates.filterProfessional },
            { id: 'creative', label: t.templates.filterCreative },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-50 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950"
            >
              {/* Paper Preview Canvas */}
              <div className="relative aspect-[1/1.25] bg-slate-100 dark:bg-slate-900 p-6 flex flex-col justify-between overflow-hidden border-b border-slate-100 dark:border-slate-800">
                {/* Simulated Resume Document Header */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm space-y-3 pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div className="space-y-1">
                      <div
                        className="h-3 w-28 rounded"
                        style={{ backgroundColor: template.accentColor }}
                      />
                      <div className="h-2 w-20 bg-slate-300 dark:bg-slate-600 rounded" />
                    </div>
                    <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-600" />
                  </div>

                  {/* Body Simulation */}
                  <div className="space-y-2 pt-1">
                    <div className="h-1.5 w-12 bg-slate-400 dark:bg-slate-500 rounded" />
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-1 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="h-1.5 w-16 bg-slate-400 dark:bg-slate-500 rounded" />
                    <div className="flex justify-between">
                      <div className="h-1.5 w-24 bg-slate-300 dark:bg-slate-600 rounded" />
                      <div className="h-1.5 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-1 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>

                {/* Floating Overlay Badge on Card */}
                <div className="flex items-center justify-between z-10">
                  <Badge variant="success" className="text-[11px] font-semibold shadow-xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{template.atsScore}</span>
                  </Badge>
                  <span className="text-xs font-medium text-slate-500 bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded backdrop-blur">
                    {template.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Template Card Content */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-2">
                  <Link href={`/builder?template=${template.id}`} className="block w-full">
                    <Button className="w-full justify-center text-xs sm:text-sm font-semibold">
                      <span>{t.templates.useTemplate}</span>
                      <ArrowIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

