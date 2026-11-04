import { create } from 'zustand';
import { SAMPLE_RESUME_AR, SAMPLE_RESUME_EN } from '../lib/sampleResumeData.ts';
import {
  AwardEntrySchema,
  CertificationEntrySchema,
  CustomSectionSchema,
  CustomSectionEntrySchema,
  EducationEntrySchema,
  ExperienceEntrySchema,
  InterestEntrySchema,
  LanguageEntrySchema,
  PublicationEntrySchema,
  ProjectEntrySchema,
  ResumeDesignSchema,
  ResumeDocumentSchema,
  RESUME_SECTION_IDS,
  SkillEntrySchema,
  VolunteeringEntrySchema,
  type PersonalInformation,
  type ResumeContent,
  type ResumeDesign,
  type ResumeDocument,
} from '../schemas/resume.schema.ts';

export type RepeatableSection =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteering'
  | 'publications'
  | 'interests'
  | 'customSections';

export interface ResumeValidationIssue {
  path: string;
  message: string;
}

export type ResumeDesignPatch = Partial<
  Omit<ResumeDesign, 'fontSizes' | 'margins' | 'sectionVisibility' | 'sectionOrder'>
> & {
  fontSizes?: Partial<ResumeDesign['fontSizes']>;
  margins?: Partial<ResumeDesign['margins']>;
  sectionVisibility?: Record<string, boolean>;
  sectionOrder?: string[];
};

interface ResumeStore {
  resume: ResumeDocument;
  validationIssues: ResumeValidationIssue[];
  isDirty: boolean;
  initializeResume: (initial?: unknown) => boolean;
  loadSampleResume: (language: 'en' | 'ar') => boolean;
  resetResume: () => void;
  validateResume: () => boolean;
  updatePersonalInformation: (patch: Partial<PersonalInformation>) => void;
  addEntry: (section: RepeatableSection, entry: unknown) => boolean;
  updateEntry: (section: RepeatableSection, id: string, patch: unknown) => boolean;
  deleteEntry: (section: RepeatableSection, id: string) => boolean;
  moveEntry: (section: RepeatableSection, id: string, direction: 'up' | 'down') => boolean;
  addCustomSectionEntry: (sectionId: string, entry: unknown) => boolean;
  updateCustomSectionEntry: (sectionId: string, entryId: string, patch: unknown) => boolean;
  deleteCustomSectionEntry: (sectionId: string, entryId: string) => boolean;
  updateDesign: (patch: ResumeDesignPatch) => boolean;
  updateSectionVisibility: (sectionId: string, visible: boolean) => boolean;
  reorderSections: (sectionOrder: string[]) => boolean;
}

const entrySchemas = {
  experience: ExperienceEntrySchema,
  education: EducationEntrySchema,
  skills: SkillEntrySchema,
  projects: ProjectEntrySchema,
  certifications: CertificationEntrySchema,
  languages: LanguageEntrySchema,
  awards: AwardEntrySchema,
  volunteering: VolunteeringEntrySchema,
  publications: PublicationEntrySchema,
  interests: InterestEntrySchema,
  customSections: CustomSectionSchema,
} as const;

export function createStableResumeId(prefix = 'entry'): string {
  const randomId = globalThis.crypto?.randomUUID?.();
  const fallbackId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${randomId ?? fallbackId}`;
}

function createEmptyResume(): ResumeDocument {
  return {
    schemaVersion: 1,
    content: {
      id: createStableResumeId('resume'),
      personal: {
        fullName: '',
        professionalTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedIn: '',
        gitHub: '',
        summary: '',
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      awards: [],
      volunteering: [],
      publications: [],
      interests: [],
      customSections: [],
    },
    design: {
      templateId: 'ats-classic',
      paperSize: 'a4',
      language: 'en',
      direction: 'ltr',
      fontFamily: 'Arial',
      fontSizes: { name: 24, heading: 16, body: 10.5, small: 9 },
      margins: { top: 14, right: 16, bottom: 14, left: 16 },
      accentColor: '#0F172A',
      sectionOrder: [...RESUME_SECTION_IDS],
      sectionVisibility: {},
    },
  };
}

function formatIssues(issues: Array<{ path: PropertyKey[]; message: string }>) {
  return issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseInitialSample(): ResumeDocument {
  return ResumeDocumentSchema.parse(SAMPLE_RESUME_EN);
}

export const useResumeStore = create<ResumeStore>((set, get) => {
  const commitDraft = (resume: ResumeDocument, isDirty = true) => {
    const result = ResumeDocumentSchema.safeParse(resume);
    if (result.success) {
      set({ resume: result.data, validationIssues: [], isDirty });
    } else {
      // Keep the user's draft intact and expose its validation errors for correction.
      set({ resume, validationIssues: formatIssues(result.error.issues), isDirty });
    }
  };

  const setIssues = (issues: Array<{ path: PropertyKey[]; message: string }>) => {
    set({ validationIssues: formatIssues(issues) });
  };

  return {
    resume: parseInitialSample(),
    validationIssues: [],
    isDirty: false,

    initializeResume: (initial) => {
      if (initial === undefined) {
        commitDraft(createEmptyResume(), false);
        return true;
      }

      const result = ResumeDocumentSchema.safeParse(initial);
      if (!result.success) {
        setIssues(result.error.issues);
        return false;
      }

      set({ resume: result.data, validationIssues: [], isDirty: false });
      return true;
    },

    loadSampleResume: (language) => {
      const sample = language === 'ar' ? SAMPLE_RESUME_AR : SAMPLE_RESUME_EN;
      const result = ResumeDocumentSchema.safeParse(sample);
      if (!result.success) {
        setIssues(result.error.issues);
        return false;
      }

      set({ resume: result.data, validationIssues: [], isDirty: false });
      return true;
    },

    resetResume: () => commitDraft(createEmptyResume(), false),

    validateResume: () => {
      const result = ResumeDocumentSchema.safeParse(get().resume);
      if (!result.success) {
        setIssues(result.error.issues);
        return false;
      }

      set({ resume: result.data, validationIssues: [] });
      return true;
    },

    updatePersonalInformation: (patch) => {
      const resume = get().resume;
      commitDraft({
        ...resume,
        content: {
          ...resume.content,
          personal: { ...resume.content.personal, ...patch },
        },
      });
    },

    addEntry: (section, entry) => {
      const value = asRecord(entry);
      if (typeof value?.id !== 'string' || !value.id.trim()) {
        set({
          validationIssues: [{ path: `content.${section}`, message: 'A stable entry ID is required.' }],
        });
        return false;
      }

      const resume = get().resume;
      const currentEntries = resume.content[section] as Array<{ id: string }>;
      if (currentEntries.some((current) => current.id === value.id)) {
        set({
          validationIssues: [{ path: `content.${section}`, message: 'Entry IDs must be unique.' }],
        });
        return false;
      }

      const parsedEntry = entrySchemas[section].safeParse(entry);
      const newEntry = parsedEntry.success ? parsedEntry.data : value;
      const content = {
        ...resume.content,
        [section]: [...currentEntries, newEntry],
      } as ResumeContent;
      commitDraft({ ...resume, content });
      return true;
    },

    updateEntry: (section, id, patch) => {
      const changes = asRecord(patch);
      if (!changes) {
        set({ validationIssues: [{ path: `content.${section}`, message: 'Entry updates must be an object.' }] });
        return false;
      }

      const resume = get().resume;
      const currentEntries = resume.content[section] as Array<{ id: string }>;
      const existing = currentEntries.find((entry) => entry.id === id);
      if (!existing) return false;

      // The existing ID is authoritative; edits cannot change an entry's identity.
      const updated = { ...existing, ...changes, id };
      const parsedEntry = entrySchemas[section].safeParse(updated);
      const nextEntry = parsedEntry.success ? parsedEntry.data : updated;
      const content = {
        ...resume.content,
        [section]: currentEntries.map((entry) => (entry.id === id ? nextEntry : entry)),
      } as ResumeContent;
      commitDraft({ ...resume, content });
      return true;
    },

    deleteEntry: (section, id) => {
      const resume = get().resume;
      const currentEntries = resume.content[section] as Array<{ id: string }>;
      if (!currentEntries.some((entry) => entry.id === id)) return false;

      const content = {
        ...resume.content,
        [section]: currentEntries.filter((entry) => entry.id !== id),
      } as ResumeContent;
      commitDraft({ ...resume, content });
      return true;
    },

    moveEntry: (section, id, direction) => {
      const resume = get().resume;
      const currentEntries = resume.content[section] as Array<{ id: string }>;
      const currentIndex = currentEntries.findIndex((entry) => entry.id === id);
      if (currentIndex < 0) return false;

      const nextIndex = currentIndex + (direction === 'up' ? -1 : 1);
      if (nextIndex < 0 || nextIndex >= currentEntries.length) return false;

      const reordered = [...currentEntries];
      [reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];
      const content = { ...resume.content, [section]: reordered } as ResumeContent;
      commitDraft({ ...resume, content });
      return true;
    },

    addCustomSectionEntry: (sectionId, entry) => {
      const value = asRecord(entry);
      if (typeof value?.id !== 'string' || !value.id.trim()) {
        set({ validationIssues: [{ path: `content.customSections.${sectionId}.entries`, message: 'A stable entry ID is required.' }] });
        return false;
      }
      const section = get().resume.content.customSections.find((item) => item.id === sectionId);
      if (!section || section.entries.some((item) => item.id === value.id)) return false;
      const parsedEntry = CustomSectionEntrySchema.safeParse(entry);
      const newEntry = parsedEntry.success ? parsedEntry.data : value;
      return get().updateEntry('customSections', sectionId, {
        entries: [...section.entries, newEntry],
      });
    },

    updateCustomSectionEntry: (sectionId, entryId, patch) => {
      const changes = asRecord(patch);
      const section = get().resume.content.customSections.find((item) => item.id === sectionId);
      if (!changes || !section) return false;
      const existing = section.entries.find((item) => item.id === entryId);
      if (!existing) return false;
      const updated = { ...existing, ...changes, id: entryId };
      const parsedEntry = CustomSectionEntrySchema.safeParse(updated);
      const nextEntry = parsedEntry.success ? parsedEntry.data : updated;
      return get().updateEntry('customSections', sectionId, {
        entries: section.entries.map((item) => item.id === entryId ? nextEntry : item),
      });
    },

    deleteCustomSectionEntry: (sectionId, entryId) => {
      const section = get().resume.content.customSections.find((item) => item.id === sectionId);
      if (!section?.entries.some((item) => item.id === entryId)) return false;
      return get().updateEntry('customSections', sectionId, {
        entries: section.entries.filter((item) => item.id !== entryId),
      });
    },

    updateDesign: (patch) => {
      const resume = get().resume;
      const candidate: ResumeDesign = {
        ...resume.design,
        ...patch,
        fontSizes: { ...resume.design.fontSizes, ...patch.fontSizes },
        margins: { ...resume.design.margins, ...patch.margins },
        sectionVisibility: { ...resume.design.sectionVisibility, ...patch.sectionVisibility },
        sectionOrder: patch.sectionOrder ?? resume.design.sectionOrder,
      };
      const designResult = ResumeDesignSchema.safeParse(candidate);
      if (!designResult.success) {
        setIssues(designResult.error.issues.map((issue) => ({
          ...issue,
          path: ['design', ...issue.path],
        })));
        return false;
      }

      commitDraft({ ...resume, design: designResult.data });
      return true;
    },

    updateSectionVisibility: (sectionId, visible) =>
      get().updateDesign({
        sectionVisibility: { [sectionId]: visible },
      }),

    reorderSections: (sectionOrder) => {
      if (new Set(sectionOrder).size !== sectionOrder.length) {
        set({
          validationIssues: [{ path: 'design.sectionOrder', message: 'Section order cannot contain duplicate IDs.' }],
        });
        return false;
      }
      return get().updateDesign({ sectionOrder });
    },
  };
});
