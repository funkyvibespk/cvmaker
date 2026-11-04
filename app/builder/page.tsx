'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  Check,
  FileText,
  FileCheck,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { TEMPLATES_REGISTRY, getTemplateById } from '@/features/templates/registry';
import { useResumeStore, createStableResumeId } from '@/stores/resumeStore';
import { toLegacyResumeData } from '@/lib/legacyResumeAdapter';
import { downloadResumeDocx } from '@/features/docx-export/downloadDocx';
import { downloadResumePdf } from '@/features/pdf-export/downloadPdf';
import { FormatComparisonModal } from '@/features/export/FormatComparisonModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('template');

  const { t } = useI18nStore();
  const resume = useResumeStore((state) => state.resume);
  const validationIssues = useResumeStore((state) => state.validationIssues);
  const updatePersonalInformation = useResumeStore((state) => state.updatePersonalInformation);
  const addEntry = useResumeStore((state) => state.addEntry);
  const updateEntry = useResumeStore((state) => state.updateEntry);
  const deleteEntry = useResumeStore((state) => state.deleteEntry);
  const updateDesign = useResumeStore((state) => state.updateDesign);
  const validateResume = useResumeStore((state) => state.validateResume);
  const personal = resume.content.personal;
  const experience = resume.content.experience[0];
  const activeTemplate = getTemplateById(resume.design.templateId);
  const paperSize = resume.design.paperSize;

  useEffect(() => {
    if (templateIdParam) updateDesign({ templateId: getTemplateById(templateIdParam).id });
  }, [templateIdParam, updateDesign]);

  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'skills'>('personal');
  const [viewMode, setViewMode] = useState<'split' | 'form-only' | 'preview-only'>('split');
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);

  const updateExperience = (patch: Record<string, unknown>) => {
    if (experience) {
      updateEntry('experience', experience.id, patch);
    } else {
      addEntry('experience', {
        id: createStableResumeId('experience'),
        jobTitle: '', employer: '', isCurrent: false, achievements: [], ...patch,
      });
    }
  };

  const experienceDateText = experience
    ? `${experience.startDate ?? ''} — ${experience.isCurrent ? 'Present' : experience.endDate ?? ''}`.trim()
    : '';
  const achievementText = experience?.achievements.map((item) => `• ${item.text}`).join('\n') ?? '';
  const skillsText = resume.content.skills.map((skill) => skill.name).join(', ');

  const updateAchievements = (value: string) => {
    const existing = experience?.achievements ?? [];
    const lines = value.split('\n').map((line) => line.trim().replace(/^[•*-]\s*/, '')).filter(Boolean);
    const achievements = lines.map((text) => ({
      id: existing.find((item) => item.text === text)?.id ?? createStableResumeId('achievement'),
      text,
    }));
    updateExperience({ achievements });
  };

  const updateSkills = (value: string) => {
    const existing = resume.content.skills;
    const names = value.split(',').map((skill) => skill.trim()).filter(Boolean);
    const nextSkills = names.map((name) => ({
      id: existing.find((skill) => skill.name === name)?.id ?? createStableResumeId('skill'),
      name,
    }));
    existing.forEach((skill) => deleteEntry('skills', skill.id));
    nextSkills.forEach((skill) => addEntry('skills', skill));
  };

  const handleExportPdf = () => {
    if (validateResume()) downloadResumePdf(personal.fullName);
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      if (!validateResume()) return;
      await downloadResumeDocx(toLegacyResumeData(resume), activeTemplate, { paperSize });
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 pb-16">
      {/* Studio Header Toolbar */}
      <div className="sticky top-16 z-30 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <Container size="full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Template Switcher & Notice */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: activeTemplate.accentColor }}
                  />
                  <span>{activeTemplate.name}</span>
                  <Badge variant="success" className="text-[10px] py-0 px-1.5">
                    {activeTemplate.categoryLabel}
                  </Badge>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Template Selector Menu */}
                {templateDropdownOpen && (
                  <div className="absolute start-0 mt-1.5 w-64 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-50 dark:border-slate-800 dark:bg-slate-900 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400">
                      {t.builder.changeTemplate}
                    </div>
                    {TEMPLATES_REGISTRY.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          updateDesign({ templateId: tpl.id });
                          setTemplateDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors text-start hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          activeTemplate.id === tpl.id
                            ? 'font-bold text-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: tpl.accentColor }}
                          />
                          <span>{tpl.name}</span>
                        </div>
                        {activeTemplate.id === tpl.id && <Check className="h-3.5 w-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/templates"
                className="hidden md:inline-flex text-xs text-blue-600 hover:underline font-medium"
              >
                {t.builder.backToTemplates}
              </Link>
            </div>

            {/* Right: Paper size, Format comparison, PDF & DOCX Export Actions */}
            <div className="flex items-center gap-2">
              {/* Paper toggle */}
              <div className="hidden sm:flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => updateDesign({ paperSize: 'a4' })}
                  className={`rounded-md px-2.5 py-1 ${
                    paperSize === 'a4'
                      ? 'bg-white shadow-2xs text-slate-900 font-semibold dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t.builder.paperA4}
                </button>
                <button
                  type="button"
                  onClick={() => updateDesign({ paperSize: 'letter' })}
                  className={`rounded-md px-2.5 py-1 ${
                    paperSize === 'letter'
                      ? 'bg-white shadow-2xs text-slate-900 font-semibold dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t.builder.paperLetter}
                </button>
              </div>

              {/* View toggle (mobile / tablet) */}
              <div className="flex lg:hidden rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs dark:border-slate-800 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'form-only' ? 'preview-only' : 'form-only')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-medium"
                >
                  {viewMode === 'form-only' ? 'Preview' : 'Form'}
                </button>
              </div>

              {/* Format Comparison Tooltip / Button */}
              <button
                type="button"
                onClick={() => setComparisonModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1.5"
                title="Compare PDF vs Word DOCX"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="text-[11px] underline">PDF vs DOCX</span>
              </button>

              {/* DOCX Export Action */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDocx}
                disabled={isExportingDocx}
                className="gap-1.5 font-semibold shadow-2xs border-slate-300 dark:border-slate-700"
              >
                {isExportingDocx ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                )}
                <span>Word (.docx)</span>
              </Button>

              {/* PDF Export Action */}
              <Button size="sm" onClick={handleExportPdf} className="gap-1.5 font-semibold shadow-xs">
                <FileCheck className="h-4 w-4" />
                <span>PDF (.pdf)</span>
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Workspace Stage */}
      <Container size="full" className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Editor Controls */}
          <div
            className={`lg:col-span-5 space-y-5 ${
              viewMode === 'preview-only' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Tab navigation */}
            <div className="flex rounded-xl border border-slate-200/90 bg-white p-1 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'personal'
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t.builder.personalTab}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('experience')}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'experience'
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t.builder.experienceTab}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'skills'
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t.builder.skillsTab}
              </button>
            </div>

            {/* Active Form Fields */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              {validationIssues.length > 0 && (
                <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                  Please correct the resume data before exporting: {validationIssues[0].message}
                </div>
              )}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.fullName}
                    </label>
                    <input
                      type="text"
                      value={personal.fullName}
                      onChange={(e) => updatePersonalInformation({ fullName: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.jobTitle}
                    </label>
                    <input
                      type="text"
                      value={personal.professionalTitle ?? ''}
                      onChange={(e) => updatePersonalInformation({ professionalTitle: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.email}
                      </label>
                      <input
                        type="email"
                        value={personal.email ?? ''}
                        onChange={(e) => updatePersonalInformation({ email: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.phone}
                      </label>
                      <input
                        type="text"
                        value={personal.phone ?? ''}
                        onChange={(e) => updatePersonalInformation({ phone: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.location}
                      </label>
                      <input
                        type="text"
                        value={personal.location ?? ''}
                        onChange={(e) => updatePersonalInformation({ location: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.portfolio}
                      </label>
                      <input
                        type="text"
                        value={personal.website ?? personal.linkedIn ?? ''}
                        onChange={(e) => updatePersonalInformation({ website: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.summary}
                    </label>
                    <textarea
                      rows={4}
                      value={personal.summary ?? ''}
                      onChange={(e) => updatePersonalInformation({ summary: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.experienceRole}
                      </label>
                      <input
                        type="text"
                        value={experience?.jobTitle ?? ''}
                        onChange={(e) => updateExperience({ jobTitle: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.experienceCompany}
                      </label>
                      <input
                        type="text"
                        value={experience?.employer ?? ''}
                        onChange={(e) => updateExperience({ employer: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.experienceDates}
                    </label>
                    <input
                      type="text"
                      value={experienceDateText}
                      onChange={(e) => {
                        const [startDate = '', ...endParts] = e.target.value.split(/[—–]/);
                        const endDate = endParts.join('—').trim();
                        updateExperience({ startDate: startDate.trim(), endDate: endDate === 'Present' ? '' : endDate, isCurrent: endDate === 'Present' });
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.experienceBullets}
                    </label>
                    <textarea
                      rows={5}
                      value={achievementText}
                      onChange={(e) => updateAchievements(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.skillsList}
                    </label>
                    <textarea
                      rows={4}
                      value={skillsText}
                      onChange={(e) => updateSkills(e.target.value)}
                      placeholder={t.builder.skillsPlaceholder}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Export formats:</p>
                    <p>PDF and Word (.docx) downloads use the current resume data.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy notice banner */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60 text-xs text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span>{t.builder.sampleNotice}</span>
            </div>
          </div>

          {/* Right Column: Simulated Live Document Canvas */}
          <div
            className={`lg:col-span-7 flex flex-col items-center ${
              viewMode === 'form-only' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Paper Sheet Preview Container */}
            <div
              id="resume-print-area"
              className={`w-full max-w-[800px] bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-200 p-8 sm:p-12 transition-all duration-300 ${
                paperSize === 'a4' ? 'min-h-[1050px]' : 'min-h-[1000px]'
              }`}
            >
              {/* Document Header */}
              <div className="border-b pb-5 mb-5" style={{ borderColor: `${activeTemplate.accentColor}33` }}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h1
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                      style={{ color: activeTemplate.accentColor }}
                    >
                      {personal.fullName || 'Your Name'}
                    </h1>
                    <p className="text-sm sm:text-base font-semibold text-slate-700 mt-0.5">
                      {personal.professionalTitle || 'Professional Title'}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 text-start sm:text-end space-y-0.5">
                    {personal.location && <div>{personal.location}</div>}
                    {personal.email && <div>{personal.email}</div>}
                    {personal.phone && <div>{personal.phone}</div>}
                    {(personal.website || personal.linkedIn) && (
                      <div className="text-blue-600">{personal.website ?? personal.linkedIn}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              {personal.summary && (
                <div className="mb-6 space-y-1.5">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider border-b pb-1"
                    style={{
                      color: activeTemplate.accentColor,
                      borderColor: `${activeTemplate.accentColor}26`,
                    }}
                  >
                    Executive Summary
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {personal.summary}
                  </p>
                </div>
              )}

              {/* Experience Section */}
              <div className="mb-6 space-y-2">
                <h2
                  className="text-xs font-bold uppercase tracking-wider border-b pb-1"
                  style={{
                    color: activeTemplate.accentColor,
                    borderColor: `${activeTemplate.accentColor}26`,
                  }}
                >
                  Work Experience
                </h2>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm">
                    <span className="font-bold text-slate-900">
                      {experience?.jobTitle || 'Role Title'}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {experienceDateText || 'Date Range'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    {experience?.employer || 'Company / Organization'}
                  </div>
                  <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pt-1">
                    {achievementText}
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              {resume.content.skills.length > 0 && (
                <div className="space-y-2">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider border-b pb-1"
                    style={{
                      color: activeTemplate.accentColor,
                      borderColor: `${activeTemplate.accentColor}26`,
                    }}
                  >
                    Core Competencies
                  </h2>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {resume.content.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2.5 py-0.5 rounded text-xs font-medium border"
                          style={{
                            borderColor: `${activeTemplate.accentColor}33`,
                            backgroundColor: `${activeTemplate.accentColor}0a`,
                            color: activeTemplate.accentColor,
                          }}
                        >
                          {skill.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Format Comparison Modal */}
      <FormatComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onDownloadPdf={handleExportPdf}
        onDownloadDocx={handleExportDocx}
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-500 text-sm">
          Loading Resume Creation Studio...
        </div>
      }
    >
      <ResumeBuilderContent />
    </Suspense>
  );
}
