'use client';

import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import type { ResumeExportModel, ResolvedResumeSection } from '@/features/export/resolveResumeExport';

const sectionTitles: Record<string, Record<string, string>> = {
  en: { summary: 'Professional Summary', experience: 'Work Experience', education: 'Education', skills: 'Skills', projects: 'Projects', certifications: 'Certifications', languages: 'Languages', awards: 'Awards', volunteering: 'Volunteering', publications: 'Publications', interests: 'Interests' },
  fr: { summary: 'Profil professionnel', experience: 'Expérience professionnelle', education: 'Formation', skills: 'Compétences', projects: 'Projets', certifications: 'Certifications', languages: 'Langues', awards: 'Distinctions', volunteering: 'Bénévolat', publications: 'Publications', interests: 'Centres d’intérêt' },
  es: { summary: 'Perfil profesional', experience: 'Experiencia profesional', education: 'Educación', skills: 'Habilidades', projects: 'Proyectos', certifications: 'Certificaciones', languages: 'Idiomas', awards: 'Premios', volunteering: 'Voluntariado', publications: 'Publicaciones', interests: 'Intereses' },
  ar: { summary: 'الملخص المهني', experience: 'الخبرة المهنية', education: 'التعليم', skills: 'المهارات', projects: 'المشاريع', certifications: 'الشهادات', languages: 'اللغات', awards: 'الجوائز', volunteering: 'العمل التطوعي', publications: 'المنشورات', interests: 'الاهتمامات' },
  ur: { summary: 'پیشہ ورانہ خلاصہ', experience: 'پیشہ ورانہ تجربہ', education: 'تعلیم', skills: 'مہارتیں', projects: 'منصوبے', certifications: 'سرٹیفیکیشنز', languages: 'زبانیں', awards: 'اعزازات', volunteering: 'رضاکارانہ کام', publications: 'اشاعتیں', interests: 'دلچسپیاں' },
};

function formatRange(start?: string, end?: string, current = false, language = 'en') {
  const present = { fr: 'En cours', es: 'Actualidad', ar: 'حتى الآن', ur: 'تاحال جاری' }[language] ?? 'Present';
  return [start, current ? present : end].filter(Boolean).join(' — ');
}

function EntryMeta({ children }: { children: ReactNode }) {
  return <p className="resume-meta">{children}</p>;
}

function Entry({ children, id }: { children: ReactNode; id: string }) {
  return <div className="resume-entry" data-entry-id={id}>{children}</div>;
}

function ResumeSection({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return (
    <section className="resume-section" data-resume-section={id}>
      <h2 className="resume-section-heading">{title}</h2>
      {children}
    </section>
  );
}

function SectionContent({ section, model }: { section: ResolvedResumeSection; model: ResumeExportModel }) {
  const textLink = (label: string, href?: string) => href ? <a href={href}>{label}</a> : null;

  switch (section.kind) {
    case 'summary':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.summary ?? sectionTitles.en.summary}><p className="resume-body whitespace-pre-line">{section.content}</p></ResumeSection>;
    case 'experience':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.experience ?? sectionTitles.en.experience}>
        {section.entries.map((entry) => <Entry key={entry.id} id={entry.id}>
          <div className="resume-entry-heading"><h3>{entry.jobTitle}</h3><span>{formatRange(entry.startDate, entry.endDate, entry.isCurrent, model.document.design.language)}</span></div>
          <EntryMeta>{[entry.employer, entry.location].filter(Boolean).join(' · ')}</EntryMeta>
          {entry.description && <p className="resume-body">{entry.description}</p>}
          {entry.achievements.length > 0 && <ul>{entry.achievements.map((item) => <li key={item.id} data-entry-id={item.id}>{item.text}</li>)}</ul>}
        </Entry>)}
      </ResumeSection>;
    case 'education':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.education ?? sectionTitles.en.education}>
        {section.entries.map((entry) => <Entry key={entry.id} id={entry.id}>
          <div className="resume-entry-heading"><h3>{entry.institution}</h3><span>{formatRange(entry.startDate, entry.endDate)}</span></div>
          <EntryMeta>{[entry.degree, entry.fieldOfStudy, entry.location].filter(Boolean).join(' · ')}</EntryMeta>
          {entry.grade && <p className="resume-body">{entry.grade}</p>}
          {entry.description && <p className="resume-body">{entry.description}</p>}
        </Entry>)}
      </ResumeSection>;
    case 'skills':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.skills ?? sectionTitles.en.skills}>
        <ul className="resume-skills">{section.entries.map((entry) => <li key={entry.id} data-entry-id={entry.id}>
          <strong>{entry.name}</strong>{entry.category && <span> · {entry.category}</span>}{entry.proficiency && <span className="resume-meta"> ({entry.proficiency})</span>}
        </li>)}</ul>
      </ResumeSection>;
    case 'projects':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.projects ?? sectionTitles.en.projects}>
        {section.entries.map((entry) => <Entry key={entry.id} id={entry.id}>
          <div className="resume-entry-heading"><h3>{textLink(entry.title, entry.url) ?? entry.title}</h3><span>{formatRange(entry.startDate, entry.endDate)}</span></div>
          {entry.role && <EntryMeta>{entry.role}</EntryMeta>}
          {entry.description && <p className="resume-body">{entry.description}</p>}
          {entry.technologies.length > 0 && <p className="resume-meta">{entry.technologies.join(' · ')}</p>}
          {entry.url && <p className="resume-meta">{entry.url}</p>}
        </Entry>)}
      </ResumeSection>;
    case 'certifications':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.certifications ?? sectionTitles.en.certifications}>
        {section.entries.map((entry) => <Entry key={entry.id} id={entry.id}>
          <div className="resume-entry-heading"><h3>{textLink(entry.name, entry.url) ?? entry.name}</h3><span>{entry.date}</span></div>
          <EntryMeta>{[entry.issuer, entry.credentialId].filter(Boolean).join(' · ')}</EntryMeta>
          {entry.url && <p className="resume-meta">{entry.url}</p>}
        </Entry>)}
      </ResumeSection>;
    case 'languages':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.languages ?? sectionTitles.en.languages}>
        <ul className="resume-inline-list">{section.entries.map((entry) => <li key={entry.id} data-entry-id={entry.id}>{entry.name}{entry.proficiency && <span> · {entry.proficiency}</span>}</li>)}</ul>
      </ResumeSection>;
    case 'awards':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.awards ?? sectionTitles.en.awards}>
        {section.entries.map((entry) => <Entry key={entry.id} id={entry.id}>
          <div className="resume-entry-heading"><h3>{entry.title}</h3><span>{entry.date}</span></div>
          {entry.issuer && <EntryMeta>{entry.issuer}</EntryMeta>}{entry.description && <p className="resume-body">{entry.description}</p>}
        </Entry>)}
      </ResumeSection>;
    case 'volunteering':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.volunteering ?? sectionTitles.en.volunteering}>
        {section.entries.map((entry) => <Entry key={entry.id} id={entry.id}>
          <div className="resume-entry-heading"><h3>{entry.role}</h3><span>{formatRange(entry.startDate, entry.endDate, entry.isCurrent, model.document.design.language)}</span></div>
          <EntryMeta>{[entry.organization, entry.location].filter(Boolean).join(' · ')}</EntryMeta>
          {entry.description && <p className="resume-body">{entry.description}</p>}
          {entry.achievements.length > 0 && <ul>{entry.achievements.map((item) => <li key={item.id} data-entry-id={item.id}>{item.text}</li>)}</ul>}
        </Entry>)}
      </ResumeSection>;
    case 'publications':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.publications ?? sectionTitles.en.publications}>
        {section.entries.map((entry) => <Entry key={entry.id} id={entry.id}>
          <div className="resume-entry-heading"><h3>{textLink(entry.title, entry.url) ?? entry.title}</h3><span>{entry.date}</span></div>
          {entry.publisher && <EntryMeta>{entry.publisher}</EntryMeta>}{entry.description && <p className="resume-body">{entry.description}</p>}
          {entry.url && <p className="resume-meta">{entry.url}</p>}
        </Entry>)}
      </ResumeSection>;
    case 'interests':
      return <ResumeSection id={section.id} title={sectionTitles[model.document.design.language]?.interests ?? sectionTitles.en.interests}>
        <ul className="resume-inline-list">{section.entries.map((entry) => <li key={entry.id} data-entry-id={entry.id}><strong>{entry.name}</strong>{entry.description && <span> · {entry.description}</span>}</li>)}</ul>
      </ResumeSection>;
    case 'custom':
      return <ResumeSection id={section.id} title={section.section.title}>
        {section.section.entries.map((entry) => <Entry key={entry.id} id={entry.id}>
          <div className="resume-entry-heading"><h3>{entry.title}</h3><span>{entry.date}</span></div>
          <EntryMeta>{[entry.subtitle, entry.location].filter(Boolean).join(' · ')}</EntryMeta>
          {entry.description && <p className="resume-body">{entry.description}</p>}
          {entry.details.length > 0 && <ul>{entry.details.map((detail, index) => <li key={`${entry.id}-${index}`}>{detail}</li>)}</ul>}
        </Entry>)}
      </ResumeSection>;
  }

  return null;
}

export function ResumePresentation({ model, className = '' }: { model: ResumeExportModel; className?: string }) {
  const { content, design } = model.document;
  const personal = content.personal;
  const paperWidth = design.paperSize === 'a4' ? '210mm' : '215.9mm';
  const paperHeight = design.paperSize === 'a4' ? '297mm' : '279.4mm';
  const fontClass = design.language === 'ur' ? 'font-urdu' : design.language === 'ar' ? 'font-arabic' : '';
  const style = {
    '--resume-accent': design.accentColor,
    '--resume-font-family': design.fontFamily,
    '--resume-font-name': `${design.fontSizes.name}pt`,
    '--resume-font-heading': `${design.fontSizes.heading}pt`,
    '--resume-font-body': `${design.fontSizes.body}pt`,
    '--resume-font-small': `${design.fontSizes.small}pt`,
    '--resume-paper-width': paperWidth,
    '--resume-paper-height': paperHeight,
    '--resume-margin-top': `${design.margins.top}mm`,
    '--resume-margin-right': `${design.margins.right}mm`,
    '--resume-margin-bottom': `${design.margins.bottom}mm`,
    '--resume-margin-left': `${design.margins.left}mm`,
  } as CSSProperties;
  const contact = [personal.email, personal.phone, personal.location].filter(Boolean);

  return (
    <article className={`resume-presentation ${fontClass} ${className}`.trim()} style={style} dir={design.direction} lang={design.language} data-paper-size={design.paperSize}>
      <div className="resume-contact-header">
        <div className="resume-identity">
          {personal.photo?.src && <Image src={personal.photo.src} alt={personal.photo.altText || personal.fullName} width={76} height={76} unoptimized className="resume-photo" />}
          <div>
            <h1>{personal.fullName}</h1>
            {personal.professionalTitle && <p className="resume-professional-title">{personal.professionalTitle}</p>}
          </div>
        </div>
        <div className="resume-contact-details">
          {contact.map((value) => <span key={value}>{value}</span>)}
          {personal.website && <a href={personal.website}>{personal.website}</a>}
          {personal.linkedIn && <a href={personal.linkedIn}>{personal.linkedIn}</a>}
          {personal.gitHub && <a href={personal.gitHub}>{personal.gitHub}</a>}
        </div>
      </div>
      <div className="resume-presentation-sections">
        {model.sections.map((section) => <SectionContent key={section.id} section={section} model={model} />)}
      </div>
    </article>
  );
}
