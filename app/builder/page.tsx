'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Printer,
  ChevronDown,
  Check,
  ArrowLeft,
  ArrowRight,
  FileText,
  FileCheck,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { TEMPLATES_REGISTRY, getTemplateById } from '@/features/templates/registry';
import { TemplateDefinition } from '@/features/templates/types';
import { ResumeData } from '@/types/resume';
import { downloadResumeDocx } from '@/features/docx-export/downloadDocx';
import { downloadResumePdf } from '@/features/pdf-export/downloadPdf';
import { FormatComparisonModal } from '@/features/export/FormatComparisonModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('template') || 'ats-classic';

  const { t, dir, locale } = useI18nStore();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const [activeTemplate, setActiveTemplate] = useState<TemplateDefinition>(() =>
    getTemplateById(templateIdParam)
  );

  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'skills'>('personal');
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');
  const [viewMode, setViewMode] = useState<'split' | 'form-only' | 'preview-only'>('split');
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);

  // Resume Universal Data State
  const [formData, setFormData] = useState({
    fullName: 'Alexander Vance',
    jobTitle: 'Principal Software Architect',
    email: 'alexander.vance@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    portfolio: 'linkedin.com/in/alexandervance',
    summary:
      'Seasoned software architect with 10+ years designing resilient distributed systems, enterprise cloud backends, and high-throughput real-time APIs. Proven track record leading multi-disciplinary engineering teams to deliver mission-critical solutions.',
    experienceRole: 'Staff Cloud Architect',
    experienceCompany: 'Enterprise Systems Inc.',
    experienceDates: '2021 — Present',
    experienceBullets:
      '• Architected core microservices handling 25M+ daily requests with 99.99% availability.\n• Reduced cloud infrastructure costs by 38% through container optimization and auto-scaling.\n• Mentored 14 senior engineers in system design principles and distributed cache architectures.',
    skills:
      'Cloud Architecture, Kubernetes, TypeScript, Go, PostgreSQL, Kafka, Terraform, Microservices, CI/CD Pipelines, High-Availability Systems',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Convert builder form state to Universal ResumeData
  const getUniversalResumeData = (): ResumeData => {
    const bulletList = formData.experienceBullets
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const skillEntries = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, idx) => ({
        id: `skill-${idx}`,
        name,
      }));

    return {
      id: 'current-session-resume',
      templateId: activeTemplate.id,
      locale,
      direction: dir,
      paperSize,
      personal: {
        fullName: formData.fullName,
        jobTitle: formData.jobTitle,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        portfolio: formData.portfolio,
        summary: formData.summary,
      },
      experience: [
        {
          id: 'exp-1',
          jobTitle: formData.experienceRole,
          company: formData.experienceCompany,
          startDate: formData.experienceDates.split('—')[0]?.trim() || '2021',
          endDate: formData.experienceDates.split('—')[1]?.trim() || 'Present',
          current: true,
          bullets: bulletList,
        },
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          school: 'University of California, Berkeley',
          endDate: '2015',
        },
      ],
      skills: skillEntries,
      projects: [],
      certifications: [],
      languages: [],
    };
  };

  const handleExportPdf = () => {
    downloadResumePdf(formData.fullName);
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      const universalData = getUniversalResumeData();
      await downloadResumeDocx(universalData, activeTemplate, { paperSize });
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
                          setActiveTemplate(tpl);
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
                  onClick={() => setPaperSize('a4')}
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
                  onClick={() => setPaperSize('letter')}
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
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.fullName}
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.jobTitle}
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
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
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.phone}
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
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
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.portfolio}
                      </label>
                      <input
                        type="text"
                        value={formData.portfolio}
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
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
                      value={formData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
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
                        value={formData.experienceRole}
                        onChange={(e) => handleInputChange('experienceRole', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.builder.experienceCompany}
                      </label>
                      <input
                        type="text"
                        value={formData.experienceCompany}
                        onChange={(e) => handleInputChange('experienceCompany', e.target.value)}
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
                      value={formData.experienceDates}
                      onChange={(e) => handleInputChange('experienceDates', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.builder.experienceBullets}
                    </label>
                    <textarea
                      rows={5}
                      value={formData.experienceBullets}
                      onChange={(e) => handleInputChange('experienceBullets', e.target.value)}
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
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder={t.builder.skillsPlaceholder}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Dual Export Guaranteed:</p>
                    <p>Both PDF and Word (.docx) exports faithfully consume your inputs and apply the selected template formatting.</p>
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
                      {formData.fullName || 'Your Name'}
                    </h1>
                    <p className="text-sm sm:text-base font-semibold text-slate-700 mt-0.5">
                      {formData.jobTitle || 'Professional Title'}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 text-start sm:text-end space-y-0.5">
                    {formData.location && <div>{formData.location}</div>}
                    {formData.email && <div>{formData.email}</div>}
                    {formData.phone && <div>{formData.phone}</div>}
                    {formData.portfolio && (
                      <div className="text-blue-600">{formData.portfolio}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              {formData.summary && (
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
                    {formData.summary}
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
                      {formData.experienceRole || 'Role Title'}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {formData.experienceDates || 'Date Range'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    {formData.experienceCompany || 'Company / Organization'}
                  </div>
                  <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pt-1">
                    {formData.experienceBullets}
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              {formData.skills && (
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
                    {formData.skills
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-0.5 rounded text-xs font-medium border"
                          style={{
                            borderColor: `${activeTemplate.accentColor}33`,
                            backgroundColor: `${activeTemplate.accentColor}0a`,
                            color: activeTemplate.accentColor,
                          }}
                        >
                          {skill}
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
