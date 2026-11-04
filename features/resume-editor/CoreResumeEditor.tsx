'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowDown, ChevronDown, Check, FileCheck, FileText,
  GraduationCap, BriefcaseBusiness, FolderKanban, Lightbulb, Loader2, Plus,
  Trash2, UserRound, Eye, Pencil, Upload, X,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FormatComparisonModal } from '@/features/export/FormatComparisonModal';
import { TextAreaField, TextField, SelectField } from '@/features/resume-editor/EditorFields';
import { useI18nStore } from '@/features/internationalization/store';
import { downloadResumeDocx } from '@/features/docx-export/downloadDocx';
import { downloadResumePdf } from '@/features/pdf-export/downloadPdf';
import { toLegacyResumeData } from '@/lib/legacyResumeAdapter';
import { TEMPLATES_REGISTRY, getTemplateById } from '@/features/templates/registry';
import { createStableResumeId, useResumeStore } from '@/stores/resumeStore';
import type { EducationEntry, ExperienceEntry, ProjectEntry, ResumeDocument, SkillEntry } from '@/schemas/resume.schema';

type CoreSection = 'personal' | 'experience' | 'education' | 'skills' | 'projects';

const sectionDetails: Array<{ id: CoreSection; label: string; icon: typeof UserRound }> = [
  { id: 'personal', label: 'Personal information', icon: UserRound },
  { id: 'experience', label: 'Work experience', icon: BriefcaseBusiness },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Lightbulb },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
];

const inputFileClass = 'sr-only';
const emptyExperience = (): ExperienceEntry => ({
  id: createStableResumeId('experience'), jobTitle: '', employer: '', isCurrent: false, achievements: [],
});
const emptyEducation = (): EducationEntry => ({ id: createStableResumeId('education'), institution: '' });
const emptyProject = (): ProjectEntry => ({ id: createStableResumeId('project'), title: '', technologies: [] });
const emptySkill = (): SkillEntry => ({ id: createStableResumeId('skill'), name: '' });

function EntryActions({
  onMoveUp, onMoveDown, onDelete, isFirst, isLast, label,
}: {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  label: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {onMoveUp && (
        <button type="button" aria-label={`Move ${label} up`} disabled={isFirst} onClick={onMoveUp}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-slate-800">
          <ArrowDown className="h-4 w-4 rotate-180" />
        </button>
      )}
      {onMoveDown && (
        <button type="button" aria-label={`Move ${label} down`} disabled={isLast} onClick={onMoveDown}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-slate-800">
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
      <button type="button" aria-label={`Delete ${label}`} onClick={onDelete}
        className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:hover:bg-rose-950/30">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

function PreviewSection({ title, accentColor, children }: { title: string; accentColor: string; children: ReactNode }) {
  return (
    <section className="mt-5 break-inside-avoid">
      <h2 className="mb-2 border-b pb-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: accentColor, borderColor: `${accentColor}35` }}>{title}</h2>
      {children}
    </section>
  );
}

function AddEntryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="w-full justify-center border-dashed">
      <Plus className="h-4 w-4" /> {label}
    </Button>
  );
}

function ResumePreview({ resume }: { resume: ResumeDocument }) {
  const { content, design } = resume;
  const personal = content.personal;
  const accentColor = getTemplateById(design.templateId).accentColor;
  const profileLinks = [
    personal.website && { label: 'Website', href: personal.website },
    personal.linkedIn && { label: 'LinkedIn', href: personal.linkedIn },
    personal.gitHub && { label: 'GitHub', href: personal.gitHub },
  ].filter((link): link is { label: string; href: string } => Boolean(link));

  return (
    <article id="resume-print-area" dir={design.direction} lang={design.language}
      className={`mx-auto min-h-[780px] w-full max-w-[680px] overflow-hidden border border-slate-200 bg-white p-6 text-slate-900 shadow-xl sm:p-9 ${design.language === 'ur' ? 'font-urdu' : design.language === 'ar' ? 'font-arabic' : ''}`}>
      <header className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: `${accentColor}40` }}>
        <div className="flex min-w-0 items-center gap-4">
          {personal.photo?.src && (
            <Image src={personal.photo.src} alt={personal.photo.altText || personal.fullName || 'Profile photo'} width={64} height={64} unoptimized className="h-16 w-16 shrink-0 rounded-full object-cover" />
          )}
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-extrabold leading-tight sm:text-3xl" style={{ color: accentColor }}>{personal.fullName || 'Your Name'}</h1>
            {personal.professionalTitle && <p className="mt-1 text-sm font-semibold text-slate-700">{personal.professionalTitle}</p>}
          </div>
        </div>
        <div className="min-w-0 space-y-1 text-xs text-slate-600 sm:text-end">
          {personal.email && <a className="block break-all hover:underline" href={`mailto:${personal.email}`}>{personal.email}</a>}
          {personal.phone && <a className="block hover:underline" href={`tel:${personal.phone}`}>{personal.phone}</a>}
          {personal.location && <p>{personal.location}</p>}
          {profileLinks.map((link) => <a key={link.label} className="block break-all text-blue-700 hover:underline" href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}
        </div>
      </header>

      {personal.summary && <PreviewSection title="Professional summary" accentColor={accentColor}><p className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{personal.summary}</p></PreviewSection>}

      <PreviewSection title="Work experience" accentColor={accentColor}>
        {content.experience.length ? <div className="space-y-4">
          {content.experience.map((entry) => (
            <div key={entry.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-sm font-bold">{entry.jobTitle || 'Job title'}</h3>
                <span className="text-[11px] text-slate-500">{[entry.startDate, entry.isCurrent ? 'Present' : entry.endDate].filter(Boolean).join(' — ')}</span>
              </div>
              <p className="text-xs font-semibold text-slate-700">{entry.employer}{entry.location ? ` · ${entry.location}` : ''}</p>
              {entry.description && <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">{entry.description}</p>}
              {entry.achievements.length > 0 && <ul className="mt-1 list-disc space-y-0.5 ps-4 text-xs leading-relaxed text-slate-600">{entry.achievements.map((achievement) => <li key={achievement.id}>{achievement.text}</li>)}</ul>}
            </div>
          ))}
        </div> : <p className="text-xs italic text-slate-400">Add experience to show it here.</p>}
      </PreviewSection>

      <PreviewSection title="Education" accentColor={accentColor}>
        {content.education.length ? <div className="space-y-3">
          {content.education.map((entry) => (
            <div key={entry.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-sm font-bold">{entry.institution || 'Institution'}</h3>
                <span className="text-[11px] text-slate-500">{[entry.startDate, entry.endDate].filter(Boolean).join(' — ')}</span>
              </div>
              <p className="text-xs text-slate-700">{[entry.degree, entry.fieldOfStudy].filter(Boolean).join(' · ')}{entry.location ? ` · ${entry.location}` : ''}</p>
              {entry.grade && <p className="text-xs text-slate-600">Grade: {entry.grade}</p>}
              {entry.description && <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">{entry.description}</p>}
            </div>
          ))}
        </div> : <p className="text-xs italic text-slate-400">Add education to show it here.</p>}
      </PreviewSection>

      <PreviewSection title="Skills" accentColor={accentColor}>
        {content.skills.length ? <div className="flex flex-wrap gap-2">
          {content.skills.map((skill) => <span key={skill.id} className="rounded border px-2 py-1 text-[11px]" style={{ borderColor: `${accentColor}35`, color: accentColor }}>
            {skill.name}{skill.category ? ` · ${skill.category}` : ''}{skill.proficiency ? ` (${skill.proficiency})` : ''}
          </span>)}
        </div> : <p className="text-xs italic text-slate-400">Add skills to show them here.</p>}
      </PreviewSection>

      <PreviewSection title="Projects" accentColor={accentColor}>
        {content.projects.length ? <div className="space-y-3">
          {content.projects.map((project) => (
            <div key={project.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-sm font-bold">{project.url ? <a href={project.url} target="_blank" rel="noreferrer" className="hover:underline">{project.title || 'Project'}</a> : project.title || 'Project'}</h3>
                <span className="text-[11px] text-slate-500">{[project.startDate, project.endDate].filter(Boolean).join(' — ')}</span>
              </div>
              {project.role && <p className="text-xs font-semibold text-slate-700">{project.role}</p>}
              {project.description && <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">{project.description}</p>}
              {project.technologies.length > 0 && <p className="mt-1 text-[11px] text-slate-500">{project.technologies.join(' · ')}</p>}
            </div>
          ))}
        </div> : <p className="text-xs italic text-slate-400">Add projects to show them here.</p>}
      </PreviewSection>
    </article>
  );
}

export function CoreResumeEditor() {
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('template');
  const { t } = useI18nStore();
  const resume = useResumeStore((state) => state.resume);
  const validationIssues = useResumeStore((state) => state.validationIssues);
  const updatePersonalInformation = useResumeStore((state) => state.updatePersonalInformation);
  const addEntry = useResumeStore((state) => state.addEntry);
  const updateEntry = useResumeStore((state) => state.updateEntry);
  const deleteEntry = useResumeStore((state) => state.deleteEntry);
  const moveEntry = useResumeStore((state) => state.moveEntry);
  const updateDesign = useResumeStore((state) => state.updateDesign);
  const validateResume = useResumeStore((state) => state.validateResume);
  const [activeSection, setActiveSection] = useState<CoreSection>('personal');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const activeTemplate = getTemplateById(resume.design.templateId);
  const personal = resume.content.personal;
  const experience = resume.content.experience;
  const education = resume.content.education;
  const skills = resume.content.skills;
  const projects = resume.content.projects;

  useEffect(() => {
    if (templateIdParam) {
      const requestedTemplateId = getTemplateById(templateIdParam).id;
      if (requestedTemplateId !== resume.design.templateId) updateDesign({ templateId: requestedTemplateId });
    }
  }, [resume.design.templateId, templateIdParam, updateDesign]);

  const issueFor = (path: string) => validationIssues.find((issue) => issue.path === path)?.message;
  const counts: Record<CoreSection, number> = {
    personal: personal.fullName ? 1 : 0,
    experience: resume.content.experience.length,
    education: resume.content.education.length,
    skills: resume.content.skills.length,
    projects: resume.content.projects.length,
  };

  const handleExportPdf = () => {
    if (validateResume()) downloadResumePdf(personal.fullName);
  };
  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      if (validateResume()) await downloadResumeDocx(toLegacyResumeData(resume), activeTemplate, { paperSize: resume.design.paperSize });
    } finally {
      setIsExportingDocx(false);
    }
  };

  const onPhotoSelected = (file?: File) => {
    setPhotoError('');
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setPhotoError('Choose a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('The photo must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setPhotoError('The selected image could not be read.');
    reader.onload = () => {
      if (typeof reader.result === 'string') updatePersonalInformation({ photo: { src: reader.result, altText: personal.fullName || 'Profile photo' } });
    };
    reader.readAsDataURL(file);
  };

  const renderedEditor = (() => {
    if (activeSection === 'personal') return (
      <>
        <SectionHeading title="Personal information" description="Add the details employers need to contact and understand you." />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="fullName" label={t.builder.fullName} autoComplete="name" value={personal.fullName} error={issueFor('content.personal.fullName')} placeholder="e.g. Jordan Lee" onChange={(event) => updatePersonalInformation({ fullName: event.target.value })} />
          <TextField id="professionalTitle" label={t.builder.jobTitle} autoComplete="organization-title" value={personal.professionalTitle ?? ''} placeholder="e.g. Senior Product Designer" onChange={(event) => updatePersonalInformation({ professionalTitle: event.target.value })} />
          <TextField id="email" label={t.builder.email} type="email" autoComplete="email" value={personal.email ?? ''} error={issueFor('content.personal.email')} placeholder="name@example.com" onChange={(event) => updatePersonalInformation({ email: event.target.value })} />
          <TextField id="phone" label={t.builder.phone} type="tel" autoComplete="tel" value={personal.phone ?? ''} placeholder="+1 555 0100" onChange={(event) => updatePersonalInformation({ phone: event.target.value })} />
          <TextField id="location" label={t.builder.location} autoComplete="address-level2" value={personal.location ?? ''} placeholder="City, Country" onChange={(event) => updatePersonalInformation({ location: event.target.value })} />
          <TextField id="website" label="Website" type="url" value={personal.website ?? ''} error={issueFor('content.personal.website')} placeholder="https://yourportfolio.com" onChange={(event) => updatePersonalInformation({ website: event.target.value || undefined })} />
          <TextField id="linkedIn" label="LinkedIn" type="url" value={personal.linkedIn ?? ''} error={issueFor('content.personal.linkedIn')} placeholder="https://linkedin.com/in/yourname" onChange={(event) => updatePersonalInformation({ linkedIn: event.target.value || undefined })} />
          <TextField id="gitHub" label="GitHub" type="url" value={personal.gitHub ?? ''} error={issueFor('content.personal.gitHub')} placeholder="https://github.com/yourname" onChange={(event) => updatePersonalInformation({ gitHub: event.target.value || undefined })} />
        </div>
        <div className="mt-4">
          <TextAreaField id="summary" label={t.builder.summary} value={personal.summary ?? ''} rows={5} placeholder="Briefly describe your experience, strengths, and the value you bring." onChange={(event) => updatePersonalInformation({ summary: event.target.value })} />
        </div>
        <div className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm font-semibold">Profile photo <span className="font-normal text-slate-500">(optional)</span></p><p className="mt-1 text-xs text-slate-500">PNG, JPEG, or WebP · up to 2 MB · stays in this browser session</p></div>
            <div className="flex items-center gap-2">
              {personal.photo?.src && <Image src={personal.photo.src} alt={personal.photo.altText || 'Profile photo'} width={44} height={44} unoptimized className="h-11 w-11 rounded-full object-cover" />}
              <label htmlFor="profilePhoto" className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 text-xs font-semibold hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 dark:border-slate-700 dark:hover:bg-slate-800"><Upload className="h-3.5 w-3.5" /> Choose photo</label>
              <input id="profilePhoto" className={inputFileClass} type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { onPhotoSelected(event.target.files?.[0]); event.currentTarget.value = ''; }} />
              {personal.photo && <button type="button" aria-label="Remove profile photo" onClick={() => updatePersonalInformation({ photo: undefined })} className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><X className="h-4 w-4" /></button>}
            </div>
          </div>
          {photoError && <p role="alert" className="mt-2 text-xs text-rose-600">{photoError}</p>}
        </div>
      </>
    );

    if (activeSection === 'experience') return (
      <>
        <SectionHeading title="Work experience" description="List roles in reverse chronological order. You can reorder them at any time." />
        <div className="space-y-4">
          {experience.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 px-4 py-7 text-center dark:border-slate-700"><BriefcaseBusiness className="mx-auto h-6 w-6 text-slate-400" /><p className="mt-2 text-sm font-medium">No work experience yet</p><p className="mt-1 text-xs text-slate-500">Add your current or most recent role to get started.</p></div>}
          {experience.map((entry, index) => {
            const entryPath = `content.experience.${index}`;
            return <section key={entry.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between gap-3"><h3 className="min-w-0 truncate text-sm font-bold">{entry.jobTitle || entry.employer || `Experience ${index + 1}`}</h3><EntryActions label="experience entry" isFirst={index === 0} isLast={index === experience.length - 1} onMoveUp={() => moveEntry('experience', entry.id, 'up')} onMoveDown={() => moveEntry('experience', entry.id, 'down')} onDelete={() => deleteEntry('experience', entry.id)} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id={`${entry.id}-jobTitle`} label="Job title" value={entry.jobTitle} error={issueFor(`${entryPath}.jobTitle`)} placeholder="e.g. Product Manager" onChange={(event) => updateEntry('experience', entry.id, { jobTitle: event.target.value })} />
                <TextField id={`${entry.id}-employer`} label="Employer" value={entry.employer} error={issueFor(`${entryPath}.employer`)} placeholder="Company or organization" onChange={(event) => updateEntry('experience', entry.id, { employer: event.target.value })} />
                <TextField id={`${entry.id}-location`} label="Location" value={entry.location ?? ''} placeholder="City, Country or Remote" onChange={(event) => updateEntry('experience', entry.id, { location: event.target.value })} />
                <div className="grid grid-cols-2 gap-3"><TextField id={`${entry.id}-startDate`} label="Start date" value={entry.startDate ?? ''} placeholder="Jan 2021" onChange={(event) => updateEntry('experience', entry.id, { startDate: event.target.value })} /><TextField id={`${entry.id}-endDate`} label="End date" value={entry.isCurrent ? '' : entry.endDate ?? ''} placeholder="Dec 2023" disabled={entry.isCurrent} onChange={(event) => updateEntry('experience', entry.id, { endDate: event.target.value })} /></div>
                <label className="flex items-center gap-2 self-end rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"><input type="checkbox" checked={entry.isCurrent} onChange={(event) => updateEntry('experience', entry.id, { isCurrent: event.target.checked, endDate: !event.target.checked && entry.endDate === 'Present' ? '' : entry.endDate })} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> I currently work here</label>
              </div>
              <div className="mt-4"><TextAreaField id={`${entry.id}-description`} label="Description" rows={3} value={entry.description ?? ''} placeholder="Describe your scope, team, or responsibilities." onChange={(event) => updateEntry('experience', entry.id, { description: event.target.value })} /></div>
              <div className="mt-4 space-y-3"><div className="flex items-center justify-between"><h4 className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Achievements</h4><Button type="button" variant="ghost" size="sm" onClick={() => updateEntry('experience', entry.id, { achievements: [...entry.achievements, { id: createStableResumeId('achievement'), text: '' }] })}><Plus className="h-3.5 w-3.5" /> Add achievement</Button></div>
                {entry.achievements.map((achievement, achievementIndex) => <div key={achievement.id} className="flex items-start gap-2"><div className="min-w-0 flex-1"><TextAreaField id={`${achievement.id}-text`} label={`Achievement ${achievementIndex + 1}`} rows={2} value={achievement.text} error={issueFor(`${entryPath}.achievements.${achievementIndex}.text`)} placeholder="What changed because of your work? Include measurable impact when possible." onChange={(event) => updateEntry('experience', entry.id, { achievements: entry.achievements.map((item) => item.id === achievement.id ? { ...item, text: event.target.value } : item) })} /></div><button type="button" aria-label={`Delete achievement ${achievementIndex + 1}`} onClick={() => updateEntry('experience', entry.id, { achievements: entry.achievements.filter((item) => item.id !== achievement.id) })} className="mt-6 rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div>)}
              </div>
            </section>;
          })}
          <AddEntryButton label="Add experience" onClick={() => addEntry('experience', emptyExperience())} />
        </div>
      </>
    );

    if (activeSection === 'education') return (
      <>
        <SectionHeading title="Education" description="Add degrees, diplomas, and other relevant study." />
        <div className="space-y-4">
          {education.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 px-4 py-7 text-center dark:border-slate-700"><GraduationCap className="mx-auto h-6 w-6 text-slate-400" /><p className="mt-2 text-sm font-medium">No education added yet</p><p className="mt-1 text-xs text-slate-500">Include the education that best supports your experience.</p></div>}
          {education.map((entry, index) => {
            const entryPath = `content.education.${index}`;
            return <section key={entry.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between gap-3"><h3 className="truncate text-sm font-bold">{entry.institution || entry.degree || `Education ${index + 1}`}</h3><EntryActions label="education entry" isFirst={index === 0} isLast={index === education.length - 1} onMoveUp={() => moveEntry('education', entry.id, 'up')} onMoveDown={() => moveEntry('education', entry.id, 'down')} onDelete={() => deleteEntry('education', entry.id)} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id={`${entry.id}-institution`} label="Institution" value={entry.institution} error={issueFor(`${entryPath}.institution`)} placeholder="University or school" onChange={(event) => updateEntry('education', entry.id, { institution: event.target.value })} />
                <TextField id={`${entry.id}-degree`} label="Degree" value={entry.degree ?? ''} placeholder="e.g. Bachelor of Science" onChange={(event) => updateEntry('education', entry.id, { degree: event.target.value })} />
                <TextField id={`${entry.id}-field`} label="Field of study" value={entry.fieldOfStudy ?? ''} placeholder="e.g. Computer Science" onChange={(event) => updateEntry('education', entry.id, { fieldOfStudy: event.target.value })} />
                <TextField id={`${entry.id}-location`} label="Location" value={entry.location ?? ''} placeholder="City, Country" onChange={(event) => updateEntry('education', entry.id, { location: event.target.value })} />
                <TextField id={`${entry.id}-start`} label="Start date" value={entry.startDate ?? ''} placeholder="Sep 2018" onChange={(event) => updateEntry('education', entry.id, { startDate: event.target.value })} />
                <TextField id={`${entry.id}-end`} label="End date" value={entry.endDate ?? ''} placeholder="May 2022" onChange={(event) => updateEntry('education', entry.id, { endDate: event.target.value })} />
                <TextField id={`${entry.id}-grade`} label="Grade or GPA" value={entry.grade ?? ''} placeholder="Optional" onChange={(event) => updateEntry('education', entry.id, { grade: event.target.value })} />
              </div>
              <div className="mt-4"><TextAreaField id={`${entry.id}-description`} label="Description" rows={3} value={entry.description ?? ''} placeholder="Relevant coursework, honors, or activities." onChange={(event) => updateEntry('education', entry.id, { description: event.target.value })} /></div>
            </section>;
          })}
          <AddEntryButton label="Add education" onClick={() => addEntry('education', emptyEducation())} />
        </div>
      </>
    );

    if (activeSection === 'skills') return (
      <>
        <SectionHeading title="Skills" description="Add relevant skills and group them by area if helpful." />
        <div className="space-y-3">
          {skills.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 px-4 py-7 text-center dark:border-slate-700"><Lightbulb className="mx-auto h-6 w-6 text-slate-400" /><p className="mt-2 text-sm font-medium">No skills added yet</p><p className="mt-1 text-xs text-slate-500">Add specific skills relevant to the roles you want.</p></div>}
          {skills.map((skill, index) => {
            const entryPath = `content.skills.${index}`;
            return <div key={skill.id} className="grid items-start gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(130px,0.8fr)_auto] dark:border-slate-800">
              <TextField id={`${skill.id}-name`} label="Skill" value={skill.name} error={issueFor(`${entryPath}.name`)} placeholder="e.g. Data analysis" onChange={(event) => updateEntry('skills', skill.id, { name: event.target.value })} />
              <TextField id={`${skill.id}-category`} label="Category" value={skill.category ?? ''} placeholder="e.g. Technical" onChange={(event) => updateEntry('skills', skill.id, { category: event.target.value || undefined })} />
              <SelectField id={`${skill.id}-proficiency`} label="Proficiency" value={skill.proficiency ?? ''} onChange={(event) => updateEntry('skills', skill.id, { proficiency: event.target.value || undefined })} options={[{ value: '', label: 'Not specified' }, { value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }, { value: 'expert', label: 'Expert' }]} />
              <button type="button" aria-label={`Delete ${skill.name || `skill ${index + 1}`}`} onClick={() => deleteEntry('skills', skill.id)} className="mt-6 rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
            </div>;
          })}
          <AddEntryButton label="Add skill" onClick={() => addEntry('skills', emptySkill())} />
        </div>
      </>
    );

    return (
      <>
        <SectionHeading title="Projects" description="Show selected work, outcomes, and the tools you used." />
        <div className="space-y-4">
          {projects.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 px-4 py-7 text-center dark:border-slate-700"><FolderKanban className="mx-auto h-6 w-6 text-slate-400" /><p className="mt-2 text-sm font-medium">No projects added yet</p><p className="mt-1 text-xs text-slate-500">Include personal, academic, or professional projects.</p></div>}
          {projects.map((project, index) => {
            const entryPath = `content.projects.${index}`;
            return <section key={project.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between gap-3"><h3 className="truncate text-sm font-bold">{project.title || `Project ${index + 1}`}</h3><EntryActions label="project" isFirst={index === 0} isLast={index === projects.length - 1} onMoveUp={() => moveEntry('projects', project.id, 'up')} onMoveDown={() => moveEntry('projects', project.id, 'down')} onDelete={() => deleteEntry('projects', project.id)} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id={`${project.id}-title`} label="Project name" value={project.title} error={issueFor(`${entryPath}.title`)} placeholder="e.g. Community Health Dashboard" onChange={(event) => updateEntry('projects', project.id, { title: event.target.value })} />
                <TextField id={`${project.id}-role`} label="Role (optional)" value={project.role ?? ''} placeholder="e.g. Lead developer" onChange={(event) => updateEntry('projects', project.id, { role: event.target.value })} />
                <TextField id={`${project.id}-start`} label="Start date" value={project.startDate ?? ''} placeholder="Jan 2023" onChange={(event) => updateEntry('projects', project.id, { startDate: event.target.value })} />
                <TextField id={`${project.id}-end`} label="End date" value={project.endDate ?? ''} placeholder="Jun 2023" onChange={(event) => updateEntry('projects', project.id, { endDate: event.target.value })} />
                <TextField id={`${project.id}-url`} label="Project URL" type="url" value={project.url ?? ''} error={issueFor(`${entryPath}.url`)} placeholder="https://example.com" onChange={(event) => updateEntry('projects', project.id, { url: event.target.value || undefined })} />
                <TextField id={`${project.id}-technologies`} label="Technologies" value={project.technologies.join(', ')} placeholder="React, TypeScript, PostgreSQL" hint="Separate technologies with commas." onChange={(event) => updateEntry('projects', project.id, { technologies: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} />
              </div>
              <div className="mt-4"><TextAreaField id={`${project.id}-description`} label="Description" rows={4} value={project.description ?? ''} placeholder="Describe the problem, your contribution, and the result." onChange={(event) => updateEntry('projects', project.id, { description: event.target.value })} /></div>
            </section>;
          })}
          <AddEntryButton label="Add project" onClick={() => addEntry('projects', emptyProject())} />
        </div>
      </>
    );
  })();

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16 dark:bg-slate-950">
      <div className="sticky top-16 z-30 border-b border-slate-200/80 bg-white/95 px-3 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-4">
        <Container size="full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <button type="button" aria-haspopup="listbox" aria-expanded={templateMenuOpen} onClick={() => setTemplateMenuOpen(!templateMenuOpen)} className="flex max-w-[230px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: activeTemplate.accentColor }} /><span className="truncate">{activeTemplate.name}</span><Badge variant="success" className="hidden px-1.5 py-0 text-[10px] sm:inline-flex">{activeTemplate.categoryLabel}</Badge><ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                </button>
                {templateMenuOpen && <div role="listbox" aria-label="Choose a template" className="absolute start-0 z-50 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  {TEMPLATES_REGISTRY.map((template) => <button key={template.id} role="option" aria-selected={activeTemplate.id === template.id} type="button" onClick={() => { updateDesign({ templateId: template.id }); setTemplateMenuOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 text-start text-xs hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:hover:bg-slate-800"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: template.accentColor }} />{template.name}</span>{activeTemplate.id === template.id && <Check className="h-4 w-4 text-blue-600" />}</button>)}
                </div>}
              </div>
              <Link href="/templates" className="hidden text-xs font-medium text-blue-600 hover:underline md:inline">{t.builder.backToTemplates}</Link>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs dark:border-slate-800 dark:bg-slate-800 sm:flex">
                <button type="button" aria-pressed={resume.design.paperSize === 'a4'} onClick={() => updateDesign({ paperSize: 'a4' })} className={`rounded-md px-2.5 py-1.5 ${resume.design.paperSize === 'a4' ? 'bg-white font-semibold shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}>{t.builder.paperA4}</button>
                <button type="button" aria-pressed={resume.design.paperSize === 'letter'} onClick={() => updateDesign({ paperSize: 'letter' })} className={`rounded-md px-2.5 py-1.5 ${resume.design.paperSize === 'letter' ? 'bg-white font-semibold shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}>{t.builder.paperLetter}</button>
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] lg:hidden dark:border-slate-800 dark:bg-slate-800">
                <button type="button" aria-pressed={mobileView === 'edit'} onClick={() => setMobileView('edit')} className={`rounded-md px-2.5 py-1.5 ${mobileView === 'edit' ? 'bg-white font-semibold shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}><Pencil className="me-1 inline h-3 w-3" />Edit</button>
                <button type="button" aria-pressed={mobileView === 'preview'} onClick={() => setMobileView('preview')} className={`rounded-md px-2.5 py-1.5 ${mobileView === 'preview' ? 'bg-white font-semibold shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}><Eye className="me-1 inline h-3 w-3" />Preview</button>
              </div>
              <button type="button" onClick={() => setComparisonModalOpen(true)} className="hidden items-center gap-1 p-2 text-xs text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:inline-flex" title="Compare PDF and Word DOCX"><FileText className="h-4 w-4" /><span className="hidden xl:inline">PDF vs DOCX</span></button>
              <Button variant="outline" size="sm" onClick={handleExportDocx} disabled={isExportingDocx} className="gap-1.5 px-2 sm:px-3">{isExportingDocx ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}<span className="hidden sm:inline">Word</span><span className="sm:hidden">DOCX</span></Button>
              <Button size="sm" onClick={handleExportPdf} className="gap-1.5 px-2 sm:px-3"><FileCheck className="h-4 w-4" /><span>PDF</span></Button>
            </div>
          </div>
        </Container>
      </div>

      <Container size="full" className="pt-4 sm:pt-6">
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[190px_minmax(330px,0.9fr)_minmax(380px,1.1fr)] xl:gap-5">
          <nav aria-label="Resume sections" className={`${mobileView === 'preview' ? 'hidden lg:block' : 'block'} lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto`}>
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Resume sections</p>
              <div className="grid grid-cols-2 gap-1 lg:grid-cols-1">
                {sectionDetails.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-current={activeSection === id ? 'step' : undefined} onClick={() => { setActiveSection(id); setMobileView('edit'); }} className={`flex min-w-0 items-center gap-2 rounded-lg px-3 py-2.5 text-start text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${activeSection === id ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}><Icon className="h-4 w-4 shrink-0" /><span className="min-w-0 flex-1 truncate">{label}</span><span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeSection === id ? 'bg-white/15 dark:bg-slate-900/10' : 'bg-slate-100 dark:bg-slate-800'}`}>{counts[id]}</span></button>)}
              </div>
              <div className="mt-3 border-t border-slate-100 px-3 py-3 text-[11px] leading-relaxed text-slate-500 dark:border-slate-800">Your resume stays in this browser session and is not uploaded.</div>
            </div>
          </nav>

          <section aria-label={`${sectionDetails.find((item) => item.id === activeSection)?.label} editor`} className={`${mobileView === 'preview' ? 'hidden lg:block' : 'block'} min-w-0`}>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
              {validationIssues.length > 0 && <div role="status" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">Some fields need attention. Fix the highlighted items before exporting.</div>}
              {renderedEditor}
            </div>
          </section>

          <aside aria-label="Live resume preview" className={`${mobileView === 'edit' ? 'hidden lg:block' : 'block'} min-w-0`}>
            <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.builder.livePreview}</h2><p className="text-xs text-slate-500">Updates as you edit</p></div><Badge variant="accent" className="shrink-0">{resume.design.paperSize === 'a4' ? 'A4' : 'US Letter'}</Badge></div>
            <div className="overflow-hidden rounded-xl bg-slate-200/70 p-2 sm:p-3 dark:bg-slate-900">{resume.design.paperSize === 'letter' ? <div className="mx-auto w-full max-w-[700px]"><ResumePreview resume={resume} /></div> : <ResumePreview resume={resume} />}</div>
          </aside>
        </div>
      </Container>

      <FormatComparisonModal isOpen={comparisonModalOpen} onClose={() => setComparisonModalOpen(false)} onDownloadPdf={handleExportPdf} onDownloadDocx={handleExportDocx} />
    </div>
  );
}
