import { z } from 'zod';

export const RESUME_LANGUAGES = ['en', 'ur', 'ar', 'fr', 'es'] as const;
export const ResumeLanguageSchema = z.enum(RESUME_LANGUAGES);

export const ResumeDirectionSchema = z.enum(['ltr', 'rtl']);
export const PaperSizeSchema = z.enum(['a4', 'letter']);

const nonEmptyText = z.string().trim().min(1, 'This field cannot be empty.');
const optionalText = z.string().trim().optional();
const httpUrl = z.url({ protocol: /^https?$/ });
const optionalUrl = httpUrl.optional();
const stableId = nonEmptyText;

function validateUniqueIds(items: Array<{ id: string }>, context: z.RefinementCtx) {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      context.addIssue({
        code: 'custom',
        path: [index, 'id'],
        message: 'IDs must be unique within a section.',
      });
    }
    seen.add(item.id);
  });
}

const photoSource = z.union([
  httpUrl,
  z.string().regex(/^blob:(?:https?:\/\/|null\/)/, 'Use a valid local image URL.'),
  z
    .string()
    .regex(
      /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/,
      'Use a PNG, JPEG, or WebP image data URL.'
    ),
]);

export const ProfilePhotoSchema = z.object({
  src: photoSource,
  altText: optionalText,
});

export const PersonalInformationSchema = z.object({
  fullName: nonEmptyText,
  professionalTitle: optionalText,
  email: z.union([z.email(), z.literal('')]).optional(),
  phone: optionalText,
  location: optionalText,
  website: optionalUrl,
  linkedIn: optionalUrl,
  gitHub: optionalUrl,
  photo: ProfilePhotoSchema.optional(),
  summary: optionalText,
});

export const AchievementSchema = z.object({
  id: stableId,
  text: nonEmptyText,
});

export const ExperienceEntrySchema = z.object({
  id: stableId,
  jobTitle: nonEmptyText,
  employer: nonEmptyText,
  location: optionalText,
  startDate: optionalText,
  endDate: optionalText,
  isCurrent: z.boolean().default(false),
  description: optionalText,
  achievements: z.array(AchievementSchema).default([]).superRefine(validateUniqueIds),
});

export const EducationEntrySchema = z.object({
  id: stableId,
  institution: nonEmptyText,
  degree: optionalText,
  fieldOfStudy: optionalText,
  location: optionalText,
  startDate: optionalText,
  endDate: optionalText,
  grade: optionalText,
  description: optionalText,
});

export const SkillProficiencySchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
  'expert',
]);

export const SkillEntrySchema = z.object({
  id: stableId,
  name: nonEmptyText,
  category: optionalText,
  proficiency: SkillProficiencySchema.optional(),
});

export const ProjectEntrySchema = z.object({
  id: stableId,
  title: nonEmptyText,
  role: optionalText,
  description: optionalText,
  url: optionalUrl,
  technologies: z.array(nonEmptyText).default([]),
  startDate: optionalText,
  endDate: optionalText,
});

export const CertificationEntrySchema = z.object({
  id: stableId,
  name: nonEmptyText,
  issuer: optionalText,
  date: optionalText,
  credentialId: optionalText,
  url: optionalUrl,
});

export const LanguageEntrySchema = z.object({
  id: stableId,
  name: nonEmptyText,
  proficiency: optionalText,
});

export const AwardEntrySchema = z.object({
  id: stableId,
  title: nonEmptyText,
  issuer: optionalText,
  date: optionalText,
  description: optionalText,
});

export const VolunteeringEntrySchema = z.object({
  id: stableId,
  role: nonEmptyText,
  organization: nonEmptyText,
  location: optionalText,
  startDate: optionalText,
  endDate: optionalText,
  isCurrent: z.boolean().default(false),
  description: optionalText,
  achievements: z.array(AchievementSchema).default([]).superRefine(validateUniqueIds),
});

export const PublicationEntrySchema = z.object({
  id: stableId,
  title: nonEmptyText,
  publisher: optionalText,
  date: optionalText,
  url: optionalUrl,
  description: optionalText,
});

export const InterestEntrySchema = z.object({
  id: stableId,
  name: nonEmptyText,
  description: optionalText,
});

export const CustomSectionEntrySchema = z.object({
  id: stableId,
  title: optionalText,
  subtitle: optionalText,
  date: optionalText,
  location: optionalText,
  description: optionalText,
  details: z.array(nonEmptyText).default([]),
});

export const CustomSectionSchema = z.object({
  id: stableId,
  title: nonEmptyText,
  entries: z.array(CustomSectionEntrySchema).default([]).superRefine(validateUniqueIds),
});

/** Resume content is independent of a selected template or paper design. */
export const ResumeContentSchema = z.object({
  id: stableId,
  personal: PersonalInformationSchema,
  experience: z.array(ExperienceEntrySchema).default([]).superRefine(validateUniqueIds),
  education: z.array(EducationEntrySchema).default([]).superRefine(validateUniqueIds),
  skills: z.array(SkillEntrySchema).default([]).superRefine(validateUniqueIds),
  projects: z.array(ProjectEntrySchema).default([]).superRefine(validateUniqueIds),
  certifications: z.array(CertificationEntrySchema).default([]).superRefine(validateUniqueIds),
  languages: z.array(LanguageEntrySchema).default([]).superRefine(validateUniqueIds),
  awards: z.array(AwardEntrySchema).default([]).superRefine(validateUniqueIds),
  volunteering: z.array(VolunteeringEntrySchema).default([]).superRefine(validateUniqueIds),
  publications: z.array(PublicationEntrySchema).default([]).superRefine(validateUniqueIds),
  interests: z.array(InterestEntrySchema).default([]).superRefine(validateUniqueIds),
  customSections: z.array(CustomSectionSchema).default([]).superRefine(validateUniqueIds),
});

export const FontSizeSettingsSchema = z.object({
  name: z.number().min(6).max(72).default(24),
  heading: z.number().min(6).max(48).default(16),
  body: z.number().min(6).max(24).default(10.5),
  small: z.number().min(6).max(18).default(9),
});

/** Margins use millimeters; font sizes use typographic points. */
export const MarginSettingsSchema = z.object({
  top: z.number().min(0).max(50).default(14),
  right: z.number().min(0).max(50).default(16),
  bottom: z.number().min(0).max(50).default(14),
  left: z.number().min(0).max(50).default(16),
});

export const RESUME_SECTION_IDS = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'awards',
  'volunteering',
  'publications',
  'interests',
  'customSections',
] as const;

/** Custom section IDs may also appear in order/visibility maps. */
const sectionId = z.string().trim().min(1);

export const ResumeDesignSchema = z.object({
  templateId: nonEmptyText,
  paperSize: PaperSizeSchema,
  language: ResumeLanguageSchema,
  direction: ResumeDirectionSchema,
  fontFamily: nonEmptyText.default('Arial'),
  fontSizes: FontSizeSettingsSchema.prefault({}),
  margins: MarginSettingsSchema.prefault({}),
  accentColor: z
    .string()
    .regex(/^#(?:[\da-f]{3}|[\da-f]{6})$/i, 'Enter a hexadecimal color such as #1E3A8A.')
    .default('#0F172A'),
  sectionOrder: z.array(sectionId).default([...RESUME_SECTION_IDS]),
  sectionVisibility: z.record(sectionId, z.boolean()).default({}),
});

/** A versioned envelope keeps content and presentation settings independent. */
export const ResumeDocumentSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  content: ResumeContentSchema,
  design: ResumeDesignSchema,
});

// Lower-case aliases are convenient for consumers that prefer value-style schema names.
export const resumeContentSchema = ResumeContentSchema;
export const resumeDesignSchema = ResumeDesignSchema;
export const resumeDocumentSchema = ResumeDocumentSchema;

export type ResumeLanguage = z.infer<typeof ResumeLanguageSchema>;
export type ResumeDirection = z.infer<typeof ResumeDirectionSchema>;
export type PaperSize = z.infer<typeof PaperSizeSchema>;
export type ProfilePhoto = z.infer<typeof ProfilePhotoSchema>;
export type PersonalInformation = z.infer<typeof PersonalInformationSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type SkillEntry = z.infer<typeof SkillEntrySchema>;
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;
export type CertificationEntry = z.infer<typeof CertificationEntrySchema>;
export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;
export type AwardEntry = z.infer<typeof AwardEntrySchema>;
export type VolunteeringEntry = z.infer<typeof VolunteeringEntrySchema>;
export type PublicationEntry = z.infer<typeof PublicationEntrySchema>;
export type InterestEntry = z.infer<typeof InterestEntrySchema>;
export type CustomSectionEntry = z.infer<typeof CustomSectionEntrySchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
export type ResumeContent = z.infer<typeof ResumeContentSchema>;
export type FontSizeSettings = z.infer<typeof FontSizeSettingsSchema>;
export type MarginSettings = z.infer<typeof MarginSettingsSchema>;
export type ResumeDesign = z.infer<typeof ResumeDesignSchema>;
export type ResumeDocument = z.infer<typeof ResumeDocumentSchema>;
