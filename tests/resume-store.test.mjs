import assert from 'node:assert/strict';
import test from 'node:test';
import { SAMPLE_RESUME_AR, SAMPLE_RESUME_EN } from '../lib/sampleResumeData.ts';
import { createStableResumeId, useResumeStore } from '../stores/resumeStore.ts';

const store = useResumeStore;

test('initializes a blank resume draft and loads the English and Arabic samples', () => {
  assert.equal(store.getState().initializeResume(), true);
  assert.equal(store.getState().resume.content.personal.fullName, '');
  assert.deepEqual(store.getState().resume.content.experience, []);
  assert.equal(store.getState().validationIssues.some((issue) => issue.path === 'content.personal.fullName'), true);

  assert.equal(store.getState().loadSampleResume('en'), true);
  assert.equal(store.getState().resume.content.id, SAMPLE_RESUME_EN.content.id);
  assert.equal(store.getState().loadSampleResume('ar'), true);
  assert.equal(store.getState().resume.design.direction, 'rtl');
  assert.equal(store.getState().resume.content.id, SAMPLE_RESUME_AR.content.id);
});

test('updates personal information in the canonical resume document', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  store.getState().updatePersonalInformation({ fullName: 'Jordan Lee', email: 'jordan@example.com' });

  assert.equal(store.getState().resume.content.personal.fullName, 'Jordan Lee');
  assert.equal(store.getState().resume.content.personal.email, 'jordan@example.com');
  assert.equal(store.getState().validationIssues.length, 0);
  assert.equal(store.getState().isDirty, true);
});

test('preserves text input exactly while typing, including trailing spaces and middle edits', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);

  store.getState().updatePersonalInformation({ fullName: 'Kamran' });
  store.getState().updatePersonalInformation({ fullName: 'Kamran ' });
  assert.equal(store.getState().resume.content.personal.fullName, 'Kamran ');
  store.getState().updatePersonalInformation({ fullName: 'Kamran  ' });
  assert.equal(store.getState().resume.content.personal.fullName, 'Kamran  ');
  store.getState().updatePersonalInformation({ fullName: 'Kamran Khan' });
  assert.equal(store.getState().resume.content.personal.fullName, 'Kamran Khan');

  // This is the exact value a controlled input emits after inserting a middle space.
  store.getState().updatePersonalInformation({ fullName: 'KamranKhan' });
  store.getState().updatePersonalInformation({ fullName: 'Kamran Khan' });
  assert.equal(store.getState().resume.content.personal.fullName, 'Kamran Khan');

  const experience = store.getState().resume.content.experience[0];
  store.getState().updateEntry('experience', experience.id, { jobTitle: 'Product Manager ' });
  assert.equal(store.getState().resume.content.experience[0].jobTitle, 'Product Manager ');
  store.getState().updateEntry('experience', experience.id, { description: 'Build products for teams ' });
  assert.equal(store.getState().resume.content.experience[0].description, 'Build products for teams ');
  assert.equal(store.getState().validationIssues.length, 0);
});

test('normalizes trimmed text only when explicit resume validation succeeds', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  store.getState().updatePersonalInformation({ fullName: 'Kamran Khan ' });
  assert.equal(store.getState().resume.content.personal.fullName, 'Kamran Khan ');
  assert.equal(store.getState().validateResume(), true);
  assert.equal(store.getState().resume.content.personal.fullName, 'Kamran Khan');
});

test('adds, edits, and deletes entries in every repeatable resume section by stable ID', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  const examples = [
    ['experience', SAMPLE_RESUME_EN.content.experience[0], { jobTitle: 'Principal Product Manager' }, 'jobTitle'],
    ['education', SAMPLE_RESUME_EN.content.education[0], { degree: 'Executive MBA' }, 'degree'],
    ['skills', SAMPLE_RESUME_EN.content.skills[0], { name: 'Portfolio strategy' }, 'name'],
    ['projects', SAMPLE_RESUME_EN.content.projects[0], { title: 'Metrics Platform' }, 'title'],
    ['certifications', SAMPLE_RESUME_EN.content.certifications[0], { name: 'Product Leadership' }, 'name'],
    ['languages', SAMPLE_RESUME_EN.content.languages[0], { proficiency: 'Fluent' }, 'proficiency'],
    ['awards', SAMPLE_RESUME_EN.content.awards[0], { title: 'Leadership Award' }, 'title'],
    ['volunteering', SAMPLE_RESUME_EN.content.volunteering[0], { role: 'Lead Mentor' }, 'role'],
    ['publications', SAMPLE_RESUME_EN.content.publications[0], { title: 'Product Strategy Notes' }, 'title'],
    ['interests', SAMPLE_RESUME_EN.content.interests[0], { name: 'Trail running' }, 'name'],
    ['customSections', SAMPLE_RESUME_EN.content.customSections[0], { title: 'Selected Talks' }, 'title'],
  ];

  for (const [section, example, patch, editedField] of examples) {
    const entry = { ...structuredClone(example), id: createStableResumeId(section) };
    const beforeCount = store.getState().resume.content[section].length;
    assert.equal(store.getState().addEntry(section, entry), true, `add ${section}`);
    assert.equal(store.getState().resume.content[section].length, beforeCount + 1, `count ${section}`);

    assert.equal(store.getState().updateEntry(section, entry.id, patch), true, `edit ${section}`);
    const updated = store.getState().resume.content[section].find((item) => item.id === entry.id);
    assert.equal(updated[editedField], patch[editedField], `value ${section}`);

    assert.equal(store.getState().deleteEntry(section, entry.id), true, `delete ${section}`);
    assert.equal(store.getState().resume.content[section].some((item) => item.id === entry.id), false);
  }
});

test('reorders repeatable entries by stable ID and respects list boundaries', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  const before = store.getState().resume.content.experience.map((entry) => entry.id);

  assert.equal(store.getState().moveEntry('experience', before[1], 'up'), true);
  assert.deepEqual(
    store.getState().resume.content.experience.map((entry) => entry.id),
    [before[1], before[0], before[2]],
  );
  assert.equal(store.getState().moveEntry('experience', before[1], 'up'), false);
  assert.equal(store.getState().moveEntry('experience', before[2], 'down'), false);
});

test('updates section visibility and ordering without changing resume content', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  const originalContentId = store.getState().resume.content.id;
  assert.equal(store.getState().updateSectionVisibility('experience', false), true);
  assert.equal(store.getState().resume.design.sectionVisibility.experience, false);

  const order = ['skills', 'experience', 'education', 'custom-speaking'];
  assert.equal(store.getState().reorderSections(order), true);
  assert.deepEqual(store.getState().resume.design.sectionOrder, order);
  assert.equal(store.getState().resume.content.id, originalContentId);
  assert.equal(store.getState().reorderSections(['skills', 'skills']), false);
});

test('adds, edits, and deletes custom-section entries using stable IDs', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  const section = store.getState().resume.content.customSections[0];
  const entry = { id: createStableResumeId('custom-entry'), title: 'Conference Speaker', details: ['Product leadership'] };

  assert.equal(store.getState().addCustomSectionEntry(section.id, entry), true);
  assert.equal(store.getState().updateCustomSectionEntry(section.id, entry.id, { title: 'Keynote Speaker' }), true);
  assert.equal(
    store.getState().resume.content.customSections.find((item) => item.id === section.id).entries.find((item) => item.id === entry.id).title,
    'Keynote Speaker',
  );
  assert.equal(store.getState().deleteCustomSectionEntry(section.id, entry.id), true);
  assert.equal(
    store.getState().resume.content.customSections.find((item) => item.id === section.id).entries.some((item) => item.id === entry.id),
    false,
  );
});

test('updates design settings and rejects invalid design values without replacing them', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  assert.equal(store.getState().updateDesign({
    paperSize: 'letter',
    fontSizes: { body: 11 },
    margins: { left: 18 },
    accentColor: '#334155',
  }), true);
  assert.equal(store.getState().resume.design.paperSize, 'letter');
  assert.equal(store.getState().resume.design.fontSizes.body, 11);
  assert.equal(store.getState().resume.design.margins.left, 18);

  assert.equal(store.getState().updateDesign({ accentColor: 'blue' }), false);
  assert.equal(store.getState().resume.design.accentColor, '#334155');
  assert.equal(store.getState().validationIssues.some((issue) => issue.path === 'design.accentColor'), true);
});

test('retains invalid personal drafts and reports validation errors instead of dropping input', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  const existingId = store.getState().resume.content.id;
  assert.equal(store.getState().initializeResume({ content: {}, design: {} }), false);
  assert.equal(store.getState().resume.content.id, existingId);
  assert.equal(store.getState().validationIssues.length > 0, true);

  store.getState().updatePersonalInformation({ email: 'not-an-email' });
  assert.equal(store.getState().resume.content.personal.email, 'not-an-email');
  assert.equal(store.getState().validateResume(), false);
  assert.equal(store.getState().validationIssues.some((issue) => issue.path === 'content.personal.email'), true);
});

test('reset creates a new blank resume and clears prior content safely', () => {
  store.getState().initializeResume(SAMPLE_RESUME_EN);
  const previousId = store.getState().resume.content.id;
  store.getState().resetResume();

  assert.notEqual(store.getState().resume.content.id, previousId);
  assert.equal(store.getState().resume.content.personal.fullName, '');
  assert.deepEqual(store.getState().resume.content.experience, []);
  assert.deepEqual(store.getState().resume.content.projects, []);
  assert.equal(store.getState().isDirty, false);
});
