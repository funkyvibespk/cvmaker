import assert from 'node:assert/strict';
import test from 'node:test';
import { SAMPLE_RESUME_AR, SAMPLE_RESUME_EN } from '../lib/sampleResumeData.ts';
import {
  ResumeContentSchema,
  ResumeDesignSchema,
  ResumeDocumentSchema,
  ProfilePhotoSchema,
} from '../schemas/resume.schema.ts';

test('validates the English sample resume across standard and custom sections', () => {
  const result = ResumeDocumentSchema.safeParse(SAMPLE_RESUME_EN);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.content.experience.length, 3);
    assert.equal(result.data.content.customSections[0]?.entries.length, 2);
  }
});

test('validates the Arabic RTL sample resume', () => {
  const result = ResumeDocumentSchema.safeParse(SAMPLE_RESUME_AR);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.design.language, 'ar');
    assert.equal(result.data.design.direction, 'rtl');
  }
});

test('rejects a missing required full name', () => {
  const content = structuredClone(SAMPLE_RESUME_EN.content);
  content.personal.fullName = '   ';
  assert.equal(ResumeContentSchema.safeParse(content).success, false);

  const experienceWithoutEmployer = structuredClone(SAMPLE_RESUME_EN.content);
  experienceWithoutEmployer.experience[0].employer = ' ';
  assert.equal(ResumeContentSchema.safeParse(experienceWithoutEmployer).success, false);
});

test('rejects invalid email addresses', () => {
  const content = structuredClone(SAMPLE_RESUME_EN.content);
  content.personal.email = 'alexandra at example dot com';
  assert.equal(ResumeContentSchema.safeParse(content).success, false);
});

test('rejects malformed or non-HTTP URLs in contact and project links', () => {
  const content = structuredClone(SAMPLE_RESUME_EN.content);
  content.personal.website = 'javascript:alert(1)';
  assert.equal(ResumeContentSchema.safeParse(content).success, false);

  const projectResume = structuredClone(SAMPLE_RESUME_EN.content);
  projectResume.projects[0].url = 'not-a-url';
  assert.equal(ResumeContentSchema.safeParse(projectResume).success, false);
});

test('supports repeated experiences and achievement entries without a fixed count cap', () => {
  const content = structuredClone(SAMPLE_RESUME_EN.content);
  content.experience.push({
    id: 'exp-many',
    jobTitle: 'Product Consultant',
    employer: 'Independent',
    achievements: Array.from({ length: 150 }, (_, index) => ({
      id: `achievement-${index}`,
      text: `Delivered project outcome ${index + 1}`,
    })),
  });
  const result = ResumeContentSchema.safeParse(content);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.experience.at(-1)?.achievements.length, 150);
});

test('rejects duplicate IDs within repeatable sections', () => {
  const content = structuredClone(SAMPLE_RESUME_EN.content);
  content.skills[1].id = content.skills[0].id;
  assert.equal(ResumeContentSchema.safeParse(content).success, false);
});

test('allows omitted optional fields and safely defaults empty sections', () => {
  const result = ResumeContentSchema.safeParse({
    id: 'minimal',
    personal: { fullName: 'Jordan Lee' },
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.personal.email, undefined);
    assert.deepEqual(result.data.experience, []);
    assert.deepEqual(result.data.customSections, []);
  }
});

test('accepts an optional local profile photo in a supported image format', () => {
  const result = ProfilePhotoSchema.safeParse({
    src: 'data:image/png;base64,aGVsbG8=',
    altText: 'Professional headshot',
  });
  assert.equal(result.success, true);
});

test('validates repeatable custom sections and their entries', () => {
  const result = ResumeContentSchema.safeParse({
    id: 'custom-test',
    personal: { fullName: 'Jordan Lee' },
    customSections: [
      {
        id: 'speaking',
        title: 'Speaking',
        entries: [
          { id: 'talk-1', title: 'Designing for clarity', details: ['Conference keynote'] },
          { id: 'talk-2', title: 'Accessible systems', date: '2024' },
        ],
      },
    ],
  });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.customSections[0]?.entries.length, 2);
});

test('validates design configuration and applies typography/layout defaults', () => {
  const result = ResumeDesignSchema.safeParse({
    templateId: 'executive-modern',
    paperSize: 'letter',
    language: 'fr',
    direction: 'ltr',
    sectionVisibility: { experience: true, 'custom-speaking': false },
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.fontFamily, 'Arial');
    assert.equal(result.data.fontSizes.body, 10.5);
    assert.equal(result.data.margins.top, 14);
    assert.equal(result.data.sectionOrder.includes('experience'), true);
  }
});

test('rejects invalid design language, paper size, color, and font sizes', () => {
  const invalidDesign = {
    templateId: 'ats-classic',
    paperSize: 'legal',
    language: 'de',
    direction: 'ltr',
    accentColor: 'blue',
    fontSizes: { body: 0 },
  };
  assert.equal(ResumeDesignSchema.safeParse(invalidDesign).success, false);
});
