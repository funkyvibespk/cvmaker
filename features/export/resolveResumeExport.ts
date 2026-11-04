import {
  RESUME_SECTION_IDS,
  type CustomSection,
  type ResumeDocument,
  type ResumeContent,
} from '../../schemas/resume.schema.ts';

type OrderedSectionId = Exclude<(typeof RESUME_SECTION_IDS)[number], 'customSections'>;

export type ResolvedResumeSection =
  | { id: 'summary'; kind: 'summary'; content: string }
  | { id: 'experience'; kind: 'experience'; entries: ResumeContent['experience'] }
  | { id: 'education'; kind: 'education'; entries: ResumeContent['education'] }
  | { id: 'skills'; kind: 'skills'; entries: ResumeContent['skills'] }
  | { id: 'projects'; kind: 'projects'; entries: ResumeContent['projects'] }
  | { id: 'certifications'; kind: 'certifications'; entries: ResumeContent['certifications'] }
  | { id: 'languages'; kind: 'languages'; entries: ResumeContent['languages'] }
  | { id: 'awards'; kind: 'awards'; entries: ResumeContent['awards'] }
  | { id: 'volunteering'; kind: 'volunteering'; entries: ResumeContent['volunteering'] }
  | { id: 'publications'; kind: 'publications'; entries: ResumeContent['publications'] }
  | { id: 'interests'; kind: 'interests'; entries: ResumeContent['interests'] }
  | { id: `custom:${string}`; kind: 'custom'; canonicalId: string; section: CustomSection };

/**
 * Export-neutral snapshot plus a deterministic, visible, non-empty section sequence.
 * `document` retains every canonical field; `sections` contains references to its
 * original records and never sorts or rewrites entry data.
 */
export interface ResumeExportModel {
  document: ResumeDocument;
  sections: ResolvedResumeSection[];
}

const orderedSectionIds = new Set<string>(RESUME_SECTION_IDS.filter((id) => id !== 'customSections'));
const customIdPrefix = 'custom:';

function createOrderedSections(document: ResumeDocument): ResolvedResumeSection[] {
  const { content, design } = document;
  const sectionVisibility = design.sectionVisibility;
  const resolved: ResolvedResumeSection[] = [];
  const includedIds = new Set<string>();
  const customSectionsById = new Map(content.customSections.map((section) => [section.id, section]));

  const appendStandardSection = (id: OrderedSectionId) => {
    if (sectionVisibility[id] === false || includedIds.has(id)) return;

    let section: ResolvedResumeSection | undefined;
    if (id === 'summary') {
      const summary = content.personal.summary;
      if (summary && summary.trim()) section = { id, kind: id, content: summary };
    } else {
      const entries = content[id];
      if (entries.length > 0) section = { id, kind: id, entries } as ResolvedResumeSection;
    }

    if (section) {
      resolved.push(section);
      includedIds.add(id);
    }
  };

  const appendCustomSection = (section: CustomSection | undefined) => {
    if (!section || sectionVisibility.customSections === false) return;
    const namespacedVisibilityKey = `${customIdPrefix}${section.id}`;
    const customVisibility = Object.hasOwn(sectionVisibility, namespacedVisibilityKey)
      ? sectionVisibility[namespacedVisibilityKey]
      : orderedSectionIds.has(section.id)
        ? undefined
        : sectionVisibility[section.id];
    if (customVisibility === false) return;

    const resolvedId = `${customIdPrefix}${section.id}` as const;
    if (includedIds.has(resolvedId) || section.entries.length === 0) return;
    resolved.push({ id: resolvedId, kind: 'custom', canonicalId: section.id, section });
    includedIds.add(resolvedId);
  };

  const appendAllCustomSections = () => {
    content.customSections.forEach(appendCustomSection);
  };

  for (const configuredId of design.sectionOrder) {
    if (configuredId === 'customSections') {
      appendAllCustomSections();
    } else if (orderedSectionIds.has(configuredId)) {
      appendStandardSection(configuredId as OrderedSectionId);
    } else if (configuredId.startsWith(customIdPrefix)) {
      appendCustomSection(customSectionsById.get(configuredId.slice(customIdPrefix.length)));
    } else {
      // Existing documents may order custom sections by their canonical IDs.
      // The `custom:` form remains unambiguous if a custom ID matches a standard ID.
      appendCustomSection(customSectionsById.get(configuredId));
    }
  }

  // Append sections missing from older/partial sectionOrder values in schema order.
  for (const id of RESUME_SECTION_IDS) {
    if (id === 'customSections') appendAllCustomSections();
    else appendStandardSection(id);
  }

  return resolved;
}

/** Resolve ordering and visibility while retaining the complete canonical document. */
export function resolveResumeExportModel(document: ResumeDocument): ResumeExportModel {
  return {
    document,
    sections: createOrderedSections(document),
  };
}
