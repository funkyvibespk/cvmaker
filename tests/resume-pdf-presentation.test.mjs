import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { resolveResumeExportModel } from '../features/export/resolveResumeExport.ts';
import { getResumePageRule } from '../features/pdf-export/printLayout.ts';
import { SAMPLE_RESUME_AR, SAMPLE_RESUME_EN } from '../lib/sampleResumeData.ts';

const editorSource = await readFile(new URL('../features/resume-editor/CoreResumeEditor.tsx', import.meta.url), 'utf8');
const printSource = await readFile(new URL('../features/pdf-export/downloadPdf.ts', import.meta.url), 'utf8');
const cssSource = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
const presentationSource = await readFile(new URL('../features/resume-preview/ResumePresentation.tsx', import.meta.url), 'utf8');

test('creates exact A4 and US Letter page rules', () => {
  assert.equal(getResumePageRule('a4'), '@page { size: 210mm 297mm; margin: 0; }');
  assert.equal(getResumePageRule('letter'), '@page { size: 215.9mm 279.4mm; margin: 0; }');
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
  assert.match(printSource, /getResumePageRule\(paperSize\)/);
  assert.match(printSource, /resume-pdf-print/);
  assert.match(printSource, /window\.print\(\)/);
  assert.match(presentationSource, /className="resume-print-margin-top"/);
  assert.match(presentationSource, /className="resume-print-margin-bottom"/);
  assert.match(presentationSource, /--resume-margin-left/);
  assert.match(cssSource, /resume-print-pages\s*>\s*thead\s*\{\s*display:\s*table-header-group/s);
  assert.match(cssSource, /resume-print-pages\s*>\s*tfoot\s*\{\s*display:\s*table-footer-group/s);
  assert.match(cssSource, /resume-presentation--print\s*\{[^}]*padding:\s*0\s*!important/s);
});
