'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layout,
  Filter,
} from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { TEMPLATES_REGISTRY } from '@/features/templates/registry';
import { TemplateDefinition, TemplateCategory } from '@/features/templates/types';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function TemplatesPage() {
  const { t, dir } = useI18nStore();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | TemplateCategory>('all');
  const [atsOnly, setAtsOnly] = useState(false);
  const [inspectingTemplate, setInspectingTemplate] = useState<TemplateDefinition | null>(null);

  const categories = [
    { id: 'all', label: t.gallery.filterAll },
    { id: 'ats', label: t.gallery.filterAts },
    { id: 'modern', label: t.gallery.filterModern },
    { id: 'corporate', label: t.gallery.filterCorporate },
    { id: 'creative', label: t.gallery.filterCreative },
    { id: 'academic', label: t.gallery.filterAcademic },
    { id: 'minimal', label: t.gallery.filterMinimal },
  ];

  const filteredTemplates = useMemo(() => {
    return TEMPLATES_REGISTRY.filter((tpl) => {
      // Category match
      if (selectedCategory !== 'all' && tpl.category !== selectedCategory) {
        return false;
      }
      // ATS only filter
      if (atsOnly && !tpl.isAtsOptimized) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = tpl.name.toLowerCase().includes(query);
        const matchesDesc = tpl.description.toLowerCase().includes(query);
        const matchesRole = tpl.recommendedFor.toLowerCase().includes(query);
        const matchesTags = tpl.tags.some((tag) => tag.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesRole || matchesTags;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, atsOnly]);

  return (
    <div className="py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      <Container>
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <Badge variant="accent" className="px-3.5 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.gallery.badge}</span>
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {t.gallery.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-10 space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.gallery.searchPlaceholder}
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* ATS High-Match Switch */}
            <label className="flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={atsOnly}
                onChange={(e) => setAtsOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{t.gallery.filterAtsOnly}</span>
              </span>
            </label>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-50 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Count Header */}
        <div className="mb-6 flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredTemplates.length}</strong>{' '}
            {t.gallery.allTemplatesCount}
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setAtsOnly(false);
              }}
              className="text-blue-600 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-4">
            <Filter className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No templates match your search</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or search keywords.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setAtsOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950"
              >
                {/* Visual Document Layout Preview */}
                <div className="relative aspect-[1/1.25] bg-slate-100 dark:bg-slate-900 p-6 flex flex-col justify-between overflow-hidden border-b border-slate-100 dark:border-slate-800">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm space-y-3 pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]">
                    {/* Header simulation based on layout */}
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

                    {/* Body columns simulation */}
                    {template.layoutType === 'sidebar' ? (
                      <div className="grid grid-cols-12 gap-2 pt-1">
                        <div className="col-span-4 bg-slate-50 dark:bg-slate-700/50 p-1.5 rounded space-y-1">
                          <div className="h-1.5 w-10 bg-slate-300 dark:bg-slate-500 rounded" />
                          <div className="h-1 w-full bg-slate-200 dark:bg-slate-600 rounded" />
                          <div className="h-1 w-3/4 bg-slate-200 dark:bg-slate-600 rounded" />
                        </div>
                        <div className="col-span-8 space-y-1.5">
                          <div className="h-1.5 w-16 bg-slate-400 dark:bg-slate-500 rounded" />
                          <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-1 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    ) : template.layoutType === 'two-column' ? (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-14 bg-slate-400 dark:bg-slate-500 rounded" />
                          <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-1 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-14 bg-slate-400 dark:bg-slate-500 rounded" />
                          <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-1 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="h-1.5 w-16 bg-slate-400 dark:bg-slate-500 rounded" />
                        <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-1 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="flex justify-between pt-1">
                          <div className="h-1.5 w-24 bg-slate-300 dark:bg-slate-600 rounded" />
                          <div className="h-1.5 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                        <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                    )}
                  </div>

                  {/* Badges on preview */}
                  <div className="flex items-center justify-between z-10">
                    <Badge variant="success" className="text-[11px] font-semibold shadow-xs">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{template.atsScore}</span>
                    </Badge>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded shadow-2xs backdrop-blur">
                      {template.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Card Info and Actions */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {template.name}
                      </h3>
                      <button
                        onClick={() => setInspectingTemplate(template)}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium shrink-0 pt-0.5"
                      >
                        {t.gallery.quickPreview}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>

                    <div className="text-[11px] text-slate-500 pt-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{t.gallery.recommendedFor}: </span>
                      <span>{template.recommendedFor}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {template.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/builder?template=${template.id}`} className="block w-full">
                      <Button className="w-full justify-center text-xs sm:text-sm font-semibold">
                        <span>{t.gallery.useThisTemplate}</span>
                        <ArrowIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Inspection Modal */}
        {inspectingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
              <button
                onClick={() => setInspectingTemplate(null)}
                className="absolute top-5 end-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-8 rounded-full"
                  style={{ backgroundColor: inspectingTemplate.accentColor }}
                />
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {inspectingTemplate.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Category: {inspectingTemplate.categoryLabel} • Score: {inspectingTemplate.atsScore}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {inspectingTemplate.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.gallery.recommendedFor}
                  </span>
                  <p className="text-slate-500">{inspectingTemplate.recommendedFor}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.gallery.layoutType}
                  </span>
                  <p className="text-slate-500 capitalize">{inspectingTemplate.layoutType.replace('-', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setInspectingTemplate(null)}>
                  {t.gallery.closePreview}
                </Button>
                <Link href={`/builder?template=${inspectingTemplate.id}`}>
                  <Button size="sm" className="font-semibold gap-1.5">
                    <span>{t.gallery.useThisTemplate}</span>
                    <ArrowIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

