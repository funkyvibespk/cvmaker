import type { ResumeDocument } from '../schemas/resume.schema';
import type { ResumeData } from '../types/resume';

/**
 * Bridges the canonical editor document to the existing DOCX generator API.
 * Exporter migration is intentionally separate from this builder milestone.
 */
export function toLegacyResumeData(document: ResumeDocument): ResumeData {
  const { content, design } = document;
  const personal = content.personal;

  return {
    id: content.id,
    templateId: design.templateId,
    locale: design.language,
    direction: design.direction,
    paperSize: design.paperSize,
    personal: {
      fullName: personal.fullName,
      jobTitle: personal.professionalTitle ?? '',
      email: personal.email ?? '',
      phone: personal.phone ?? '',
      location: personal.location ?? '',
      portfolio: personal.website ?? personal.linkedIn ?? '',
      website: personal.website,
      linkedin: personal.linkedIn,
      github: personal.gitHub,
      photoUrl: personal.photo?.src,
      summary: personal.summary ?? '',
    },
    experience: content.experience.map((entry) => ({
      id: entry.id,
      jobTitle: entry.jobTitle,
      company: entry.employer,
      location: entry.location,
      startDate: entry.startDate ?? '',
      endDate: entry.isCurrent ? 'Present' : entry.endDate ?? '',
      current: entry.isCurrent,
      bullets: [
        ...(entry.description ? [entry.description] : []),
        ...entry.achievements.map((achievement) => achievement.text),
      ],
    })),
    education: content.education.map((entry) => ({
      id: entry.id,
      degree: [entry.degree, entry.fieldOfStudy].filter(Boolean).join(', '),
      school: entry.institution,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate ?? '',
      gpa: entry.grade,
      bullets: entry.description ? [entry.description] : [],
    })),
    skills: content.skills.map((entry) => ({
      id: entry.id,
      name: entry.name,
      category: entry.category,
    })),
    projects: content.projects.map((entry) => ({
      id: entry.id,
      title: entry.title,
      description: [
        entry.description,
        entry.technologies.length ? `Technologies: ${entry.technologies.join(', ')}` : undefined,
        entry.url,
      ]
        .filter(Boolean)
        .join('\n'),
      link: entry.url,
      technologies: entry.technologies,
    })),
    certifications: content.certifications.map((entry) => ({
      id: entry.id,
      name: entry.name,
      issuer: entry.issuer ?? '',
      date: entry.date ?? '',
    })),
    languages: content.languages.map((entry) => ({
      id: entry.id,
      language: entry.name,
      proficiency: entry.proficiency ?? '',
    })),
  };
}
