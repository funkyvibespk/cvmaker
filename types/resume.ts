import { SupportedLocale, Direction } from '@/features/internationalization/types';

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  portfolio?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  photoUrl?: string; // Optional base64 or blob URL
}

export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate?: string;
  endDate: string;
  gpa?: string;
  bullets?: string[];
}

export interface SkillEntry {
  id: string;
  name: string;
  category?: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: string;
}

export interface ResumeData {
  id: string;
  templateId: string;
  locale: SupportedLocale;
  direction: Direction;
  paperSize: 'a4' | 'letter';
  personal: PersonalDetails;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
}

export interface ExportOptions {
  paperSize: 'a4' | 'letter';
  format: 'pdf' | 'docx';
  includePhoto?: boolean;
}

// Canonical schema-derived types are available alongside the legacy ResumeData
// shape until the builder and exporters migrate in a later milestone.
export type {
  Achievement,
  AwardEntry,
  CertificationEntry as CanonicalCertificationEntry,
  CustomSection,
  CustomSectionEntry,
  EducationEntry as CanonicalEducationEntry,
  ExperienceEntry as CanonicalExperienceEntry,
  InterestEntry,
  LanguageEntry as CanonicalLanguageEntry,
  MarginSettings,
  PaperSize as CanonicalPaperSize,
  PersonalInformation,
  ProfilePhoto,
  ProjectEntry as CanonicalProjectEntry,
  PublicationEntry,
  ResumeContent,
  ResumeDesign,
  ResumeDirection,
  ResumeDocument,
  ResumeLanguage,
  SkillEntry as CanonicalSkillEntry,
  VolunteeringEntry,
} from '../schemas/resume.schema';
