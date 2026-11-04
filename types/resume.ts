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
