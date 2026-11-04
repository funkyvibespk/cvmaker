import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { resolveResumeExportModel } from '../features/export/resolveResumeExport.ts';
import { getResumePageRule } from '../features/pdf-export/printLayout.ts';
import { SAMPLE_RESUME_AR, SAMPLE_RESUME_EN } from '../lib/sampleResumeData.ts';

const editorSource = await readFile(new URL('../features/resume-editor/CoreResumeEditor.tsx', import.meta.url), 'utf8');
const printSource = await readFile(new URL('../features/pdf-export/downloadPdf.ts', import.meta.url), 'utf8');
const cssSource = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');

test('creates exact A4 and US Letter page rules', () => {
  const margins = { top: 14, right: 16, bottom: 14, left: 16 };
  assert.equal(getResumePageRule('a4', margins), '@page { size: 210mm 297mm; margin: 14mm 16mm 14mm 16mm; }');
  assert.equal(getResumePageRule('letter', margins), '@page { size: 215.9mm 279.4mm; margin: 14mm 16mm 14mm 16mm; }');
  assert.equal(getResumePageRule('a4', { top: 10, right: 12, bottom: 15, left: 18 }), '@page { size: 210mm 297mm; margin: 10mm 12mm 15mm 18mm; }');
});

test('shared presentation model retains every resolved English section and design token', () => {
  const model = resolveResumeExportModel(SAMPLE_RESUME_EN);
  assert.deepEqual(model.sections.map((section) => section.id), [
    'summary', 'experience', 'education', 'skills', 'projects', 'custom:custom-speaking',
    'certifications', 'languages', 'awards', 'volunteering', 'publications', 'interests',
  ]);
  assert.deepEqual(model.sections.find((section) => section.id === 'experience').entries, SAMPLE_RESUME_EN.content.experience);
  assert.deepEqual(model.document.design, SAMPLE_RESUME_EN.design);
});

test('shared presentation model retains Arabic content and RTL design', () => {
  const model = resolveResumeExportModel(SAMPLE_RESUME_AR);
  assert.equal(model.document.design.direction, 'rtl');
  assert.equal(model.document.design.language, 'ar');
  assert.deepEqual(model.sections.find((section) => section.id === 'publications').entries, SAMPLE_RESUME_AR.content.publications);
  assert.deepEqual(model.sections.find((section) => section.id === 'custom:custom-ar-initiatives').section, SAMPLE_RESUME_AR.content.customSections[0]);
});

test('PDF export snapshots the current store document and renders it in an isolated root', () => {
  const handler = editorSource.match(/const handleExportPdf = \(\) => \{[\s\S]*?\n  \};/)?.[0];
  assert.ok(handler, 'PDF handler exists');
  assert.match(handler, /useResumeStore\.getState\(\)\.resume/);
  assert.match(handler, /resolveResumeExportModel\(currentResume\)/);
  assert.doesNotMatch(handler, /activeSection|mobileView/);
  assert.match(editorSource, /id="resume-pdf-document"[\s\S]*?<ResumePresentation model=\{pdfExportModel \?\? previewModel\}/);
  assert.match(editorSource, /<ResumePresentation model=\{previewModel\} className="resume-presentation--preview"/);
});

test('print page configuration follows the PDF export model paper size', () => {
  assert.match(printSource, /getResumePageRule\(paperSize, margins\)/);
  assert.match(printSource, /resume-pdf-print/);
  assert.match(printSource, /window\.print\(\)/);
  assert.match(editorSource, /document\.design\.margins/);
  assert.match(cssSource, /resume-presentation--print\s*\{[^}]*width:\s*100%[^}]*padding:\s*0\s*!important/s);
});
