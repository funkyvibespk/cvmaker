import assert from 'node:assert/strict';
import test from 'node:test';
import { SAMPLE_RESUME_AR, SAMPLE_RESUME_EN } from '../lib/sampleResumeData.ts';
import { resolveResumeExportModel } from '../features/export/resolveResumeExport.ts';

test('resolves every populated canonical section without dropping source fields', () => {
  const resume = structuredClone(SAMPLE_RESUME_EN);
  resume.content.experience.reverse();
  const resolved = resolveResumeExportModel(resume);

  assert.equal(resolved.document, resume);
  assert.deepEqual(resolved.document.content, resume.content);
  assert.deepEqual(resolved.document.design, resume.design);
  assert.deepEqual(resolved.sections.map((section) => section.id), [
    'summary', 'experience', 'education', 'skills', 'projects', 'custom:custom-speaking',
    'certifications', 'languages', 'awards', 'volunteering', 'publications', 'interests',
  ]);

  for (const id of ['experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'awards', 'volunteering', 'publications', 'interests']) {
    const section = resolved.sections.find((candidate) => candidate.id === id);
    assert.deepEqual(section.entries, resume.content[id], `${id} retains every entry and field`);
  }
  assert.equal(resolved.sections.find((section) => section.id === 'summary').content, resume.content.personal.summary);
  assert.deepEqual(
    resolved.sections.find((section) => section.kind === 'custom').section,
    resume.content.customSections[0],
  );
  assert.deepEqual(
    resolved.sections.find((section) => section.id === 'experience').entries.map((entry) => entry.id),
    resume.content.experience.map((entry) => entry.id),
    'the resolver preserves explicit entry ordering',
  );
});

test('uses configured order and visibility without deleting hidden content', () => {
  const resume = structuredClone(SAMPLE_RESUME_EN);
  resume.design.sectionOrder = [
    'projects', 'experience', 'custom-speaking', 'certifications', 'languages', 'awards',
    'volunteering', 'publications', 'interests', 'education', 'skills', 'summary',
  ];
  resume.design.sectionVisibility.languages = false;
  resume.design.sectionVisibility.volunteering = false;
  resume.design.sectionVisibility['custom-speaking'] = false;

  const resolved = resolveResumeExportModel(resume);
  assert.deepEqual(resolved.sections.map((section) => section.id), [
    'projects', 'experience', 'certifications', 'awards',
    'publications', 'interests', 'education', 'skills', 'summary',
  ]);
  assert.equal(resolved.document.content.languages.length, SAMPLE_RESUME_EN.content.languages.length);
  assert.equal(resolved.document.content.volunteering.length, SAMPLE_RESUME_EN.content.volunteering.length);
  assert.equal(resolved.document.content.customSections.length, SAMPLE_RESUME_EN.content.customSections.length);
});

test('appends sections missing from a partial order deterministically', () => {
  const resume = structuredClone(SAMPLE_RESUME_EN);
  resume.design.sectionOrder = ['projects', 'experience'];

  const expected = [
    'projects', 'experience', 'summary', 'education', 'skills', 'certifications',
    'languages', 'awards', 'volunteering', 'publications', 'interests', 'custom:custom-speaking',
  ];
  assert.deepEqual(resolveResumeExportModel(resume).sections.map((section) => section.id), expected);
  assert.deepEqual(resolveResumeExportModel(resume).sections.map((section) => section.id), expected);
});

test('keeps empty optional sections safe while retaining them in the full document', () => {
  const resume = structuredClone(SAMPLE_RESUME_EN);
  resume.content.personal.summary = undefined;
  for (const section of [
    'experience', 'education', 'skills', 'projects', 'certifications', 'languages',
    'awards', 'volunteering', 'publications', 'interests', 'customSections',
  ]) resume.content[section] = [];

  const resolved = resolveResumeExportModel(resume);
  assert.deepEqual(resolved.sections, []);
  assert.deepEqual(resolved.document.content, resume.content);
});

test('preserves Arabic content, RTL design, optional fields, and custom entries', () => {
  const resolved = resolveResumeExportModel(SAMPLE_RESUME_AR);
  const { content, design } = resolved.document;

  assert.equal(design.language, 'ar');
  assert.equal(design.direction, 'rtl');
  assert.deepEqual(design, SAMPLE_RESUME_AR.design);
  assert.deepEqual(content.personal, SAMPLE_RESUME_AR.content.personal);
  assert.deepEqual(resolved.sections.find((section) => section.id === 'experience').entries, content.experience);
  assert.deepEqual(resolved.sections.find((section) => section.id === 'custom:custom-ar-initiatives').section.entries, content.customSections[0].entries);
  assert.equal(resolved.sections.find((section) => section.id === 'experience').entries[0].achievements[0].text, content.experience[0].achievements[0].text);
});
