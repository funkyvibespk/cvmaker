import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateRawSync } from 'node:zlib';
import test from 'node:test';
import { generateResumeDocx } from '../features/docx-export/generateDocx.ts';
import { resolveResumeExportModel } from '../features/export/resolveResumeExport.ts';
import { SAMPLE_RESUME_AR, SAMPLE_RESUME_EN } from '../lib/sampleResumeData.ts';

const profilePhotos = {
  png: new Uint8Array(await readFile(new URL('./fixtures/profile-photo.png', import.meta.url))),
  jpg: new Uint8Array(await readFile(new URL('./fixtures/profile-photo.jpg', import.meta.url))),
  webp: new Uint8Array(await readFile(new URL('./fixtures/profile-photo.webp', import.meta.url))),
};

function zipEntries(bytes) {
  const entries = new Map();
  let offset = 0;
  while (offset + 30 < bytes.length && bytes.readUInt32LE(offset) === 0x04034b50) {
    const method = bytes.readUInt16LE(offset + 8);
    const compressedSize = bytes.readUInt32LE(offset + 18);
    const nameLength = bytes.readUInt16LE(offset + 26);
    const extraLength = bytes.readUInt16LE(offset + 28);
    const name = bytes.toString('utf8', offset + 30, offset + 30 + nameLength);
    const dataStart = offset + 30 + nameLength + extraLength;
    const compressed = bytes.subarray(dataStart, dataStart + compressedSize);
    entries.set(name, method === 8 ? inflateRawSync(compressed) : compressed);
    offset = dataStart + compressedSize;
  }
  return entries;
}

async function docxParts(document) {
  const blob = await generateResumeDocx(resolveResumeExportModel(document));
  const entries = zipEntries(Buffer.from(await blob.arrayBuffer()));
  return {
    blob,
    entries,
    xml: entries.get('word/document.xml')?.toString('utf8') ?? '',
    relationships: entries.get('word/_rels/document.xml.rels')?.toString('utf8') ?? '',
  };
}

function textFromXml(xml) {
  return [...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)]
    .map((match) => match[1].replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&apos;', "'"))
    .join(' ');
}

function twips(mm) {
  return Math.round((mm * 1440) / 25.4);
}

function xmlAttribute(xml, elementName, attributeName) {
  const element = xml.match(new RegExp(`<w:${elementName}\\b([^>]*)`))?.[1] ?? '';
  return element.match(new RegExp(`\\bw:${attributeName}="([^"]+)"`))?.[1];
}

test('DOCX contains every visible canonical section and structured entry content', async () => {
  const document = structuredClone(SAMPLE_RESUME_EN);
  document.content.certifications[0].credentialId = 'credential-42';
  document.content.certifications[0].url = 'https://example.com/certificate';
  document.content.personal.gitHub = 'https://github.com/alexchen';
  document.content.education[1].grade = '3.8 GPA';
  document.content.education[1].description = 'Capstone research on scalable software systems.';
  document.content.projects[0].startDate = '2022';
  document.content.projects[0].endDate = '2023';
  document.content.awards[0].date = '2023';
  document.content.volunteering[0].description = 'Support a regional mentoring community.';
  document.content.publications[0].description = 'Research findings for product teams.';
  document.content.interests[0].description = 'Volunteer mentor for local founders.';
  document.content.customSections[0].entries[0].location = 'San Francisco, CA';
  document.content.customSections[0].entries[0].description = 'A featured industry presentation.';
  const { xml, relationships } = await docxParts(document);
  const text = textFromXml(xml);
  for (const value of [
    'Alexandra Chen', 'Senior Product Manager', 'alex.chen@example.com', '+1 (415) 555-0192',
    'San Francisco, CA', 'https://linkedin.com/in/alexchen', 'https://alexchen.io', 'https://github.com/alexchen',
    'Product leader with eight years', 'TechCorp Global', 'Launched a B2B analytics platform',
    'StartupAI Inc.', 'Reduced recommendation service latency', 'Stanford Graduate School of Business',
    '3.9 GPA', '3.8 GPA', 'Capstone research on scalable software systems.', 'SQL and data analysis', 'expert',
    'ProductMetrics Dashboard', 'Project Lead', 'Technologies: React, TypeScript, D3.js',
    'Certified Product Manager', 'credential-42', 'English', 'Customer Impact Award', '2023', 'Women in Product',
    'Mentor early-career product managers', 'Support a regional mentoring community.',
    'A Practical Guide to Product Discovery at Scale', 'Research findings for product teams.',
    'Community mentoring', 'Volunteer mentor for local founders.', 'Selected Speaking', 'ProductCon San Francisco',
    'A featured industry presentation.',
  ]) assert.ok(text.includes(value), `expected DOCX text to contain: ${value}`);
  assert.match(relationships, /Target="https:\/\/github\.com\/alexchen\/productmetrics"/);
  assert.match(relationships, /Target="https:\/\/github\.com\/alexchen"/);
  assert.match(relationships, /Target="https:\/\/example\.com\/certificate"/);
  assert.match(relationships, /Target="mailto:alex\.chen@example\.com"/);
  assert.match(xml, /w:numPr/);
});

test('DOCX keeps editable identity and vertically stacked contacts in a two-column ruled header', async () => {
  const document = structuredClone(SAMPLE_RESUME_EN);
  document.content.personal.gitHub = 'https://github.com/alexchen';
  const { xml, relationships } = await docxParts(document);
  const headerTable = xml.match(/<w:tbl\b[\s\S]*?<\/w:tbl>/)?.[0];
  assert.ok(headerTable, 'header is a native Word table even without a profile photo');
  const row = headerTable.match(/<w:tr\b[\s\S]*?<\/w:tr>/)?.[0];
  assert.ok(row);
  const cells = [...row.matchAll(/<w:tc\b[\s\S]*?<\/w:tc>/g)].map((match) => match[0]);
  assert.equal(cells.length, 2, 'identity and contact details occupy separate columns');
  assert.ok(textFromXml(cells[0]).includes('Alexandra Chen'));
  assert.ok(textFromXml(cells[0]).includes('Senior Product Manager'));
  assert.ok(!textFromXml(cells[0]).includes('alex.chen@example.com'));
  for (const value of ['alex.chen@example.com', '+1 (415) 555-0192', 'San Francisco, CA', 'https://alexchen.io', 'https://linkedin.com/in/alexchen', 'https://github.com/alexchen']) {
    assert.ok(textFromXml(cells[1]).includes(value), `contact column retains ${value}`);
  }
  const contactParagraphs = [...cells[1].matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((match) => textFromXml(match[0]));
  assert.equal(contactParagraphs.length, 6, 'each available contact value has its own vertically stacked paragraph');
  assert.ok(headerTable.includes('<w:bottom w:val="single"'), 'header has an editable Word bottom divider');
  assert.match(relationships, /Target="mailto:alex\.chen@example\.com"/);
  assert.match(relationships, /Target="tel:\+14155550192"/);
});

test('DOCX follows resolver order and excludes hidden sections without losing visible records', async () => {
  const document = structuredClone(SAMPLE_RESUME_EN);
  document.content.certifications[0].name = 'HIDDEN_CERTIFICATE_MARKER';
  document.design.sectionOrder = ['projects', 'experience', 'summary', 'custom-speaking', 'education', 'skills', 'certifications'];
  document.design.sectionVisibility = { certifications: false };
  const { xml } = await docxParts(document);
  const text = textFromXml(xml);
  assert.ok(text.indexOf('Projects') < text.indexOf('Work Experience'));
  assert.ok(text.indexOf('Work Experience') < text.indexOf('Professional Summary'));
  assert.ok(text.indexOf('Professional Summary') < text.indexOf('Selected Speaking'));
  assert.ok(!text.includes('HIDDEN_CERTIFICATE_MARKER'));
  assert.ok(text.includes('ProductMetrics Dashboard'));
  assert.ok(text.includes('Metrics That Improve Product Decisions'));
});

test('DOCX Arabic output preserves RTL paragraphs and Arabic content', async () => {
  const { xml } = await docxParts(SAMPLE_RESUME_AR);
  const text = textFromXml(xml);
  assert.ok(text.includes('أحمد الراشد'));
  assert.ok(text.includes('شركة التقنية المتقدمة'));
  assert.match(xml, /<w:bidi\/>/);
  assert.match(xml, /w:rtl/);
});

test('DOCX writes exact A4 and Letter dimensions and configured margins', async () => {
  const a4 = structuredClone(SAMPLE_RESUME_EN);
  a4.design.margins = { top: 12, right: 18, bottom: 15, left: 20 };
  const a4Result = await docxParts(a4);
  assert.equal(xmlAttribute(a4Result.xml, 'pgSz', 'w'), String(twips(210)));
  assert.equal(xmlAttribute(a4Result.xml, 'pgSz', 'h'), String(twips(297)));
  assert.equal(xmlAttribute(a4Result.xml, 'pgMar', 'top'), String(twips(12)));
  assert.equal(xmlAttribute(a4Result.xml, 'pgMar', 'right'), String(twips(18)));
  assert.equal(xmlAttribute(a4Result.xml, 'pgMar', 'bottom'), String(twips(15)));
  assert.equal(xmlAttribute(a4Result.xml, 'pgMar', 'left'), String(twips(20)));

  const letter = structuredClone(SAMPLE_RESUME_EN);
  letter.design.paperSize = 'letter';
  const letterResult = await docxParts(letter);
  assert.equal(xmlAttribute(letterResult.xml, 'pgSz', 'w'), String(twips(215.9)));
  assert.equal(xmlAttribute(letterResult.xml, 'pgSz', 'h'), String(twips(279.4)));
});

test('DOCX embeds PNG and JPEG sample portrait bytes with an image relationship and intact proportions', async () => {
  for (const [format, mimeType] of [['png', 'image/png'], ['jpg', 'image/jpeg']]) {
    const withPhoto = structuredClone(SAMPLE_RESUME_EN);
    const source = `data:${mimeType};base64,${Buffer.from(profilePhotos[format]).toString('base64')}`;
    withPhoto.content.personal.photo = { src: source, altText: 'Sample profile portrait' };
    const photoResult = await docxParts(withPhoto);
    assert.ok([...photoResult.entries.keys()].some((name) => new RegExp(`^word/media/image\\d+\\.${format}$`).test(name)));
    assert.match(photoResult.relationships, /relationships\/image/);
    assert.match(photoResult.xml, /pic:pic/);
    assert.match(photoResult.xml, /Sample profile portrait/);
    const extent = photoResult.xml.match(/<wp:extent cx="(\d+)" cy="(\d+)"/);
    assert.ok(extent);
    assert.ok(Math.abs(Number(extent[1]) / Number(extent[2]) - 0.8) < 0.02);
    const contentTypes = photoResult.entries.get('[Content_Types].xml').toString('utf8');
    assert.match(contentTypes, new RegExp(`ContentType="image/${format === 'jpg' ? 'jpeg' : 'png'}" Extension="${format}"`));
  }
});

test('DOCX safely converts WebP photos to PNG in browser-capable environments', async () => {
  const previousBitmap = globalThis.createImageBitmap;
  const previousDocument = globalThis.document;
  globalThis.createImageBitmap = async () => ({ width: 320, height: 400, close() {} });
  globalThis.document = {
    createElement() {
      return {
        width: 0,
        height: 0,
        getContext: () => ({ drawImage() {} }),
        toBlob(callback) { callback(new Blob([profilePhotos.png], { type: 'image/png' })); },
      };
    },
  };
  try {
    const document = structuredClone(SAMPLE_RESUME_EN);
    document.content.personal.photo = {
      src: `data:image/webp;base64,${Buffer.from(profilePhotos.webp).toString('base64')}`,
      altText: 'WebP sample portrait',
    };
    const result = await docxParts(document);
    assert.ok([...result.entries.keys()].some((name) => /^word\/media\/image\d+\.png$/.test(name)));
    assert.match(result.relationships, /relationships\/image/);
  } finally {
    if (previousBitmap) globalThis.createImageBitmap = previousBitmap;
    else delete globalThis.createImageBitmap;
    if (previousDocument) globalThis.document = previousDocument;
    else delete globalThis.document;
  }
});

test('DOCX handles missing or invalid photos without blocking export', async () => {
  const withoutPhoto = structuredClone(SAMPLE_RESUME_EN);
  delete withoutPhoto.content.personal.photo;
  const noPhotoResult = await docxParts(withoutPhoto);
  assert.ok(![...noPhotoResult.entries.keys()].some((name) => name.startsWith('word/media/')));

  const invalidPhoto = structuredClone(SAMPLE_RESUME_EN);
  invalidPhoto.content.personal.photo = { src: 'data:image/png;base64,AAAA', altText: 'Unavailable image' };
  const invalidPhotoResult = await docxParts(invalidPhoto);
  assert.ok(textFromXml(invalidPhotoResult.xml).includes('Alexandra Chen'));
  assert.ok(![...invalidPhotoResult.entries.keys()].some((name) => name.startsWith('word/media/')));
});

test('DOCX preserves long content and handles omitted optional fields safely', async () => {
  const document = structuredClone(SAMPLE_RESUME_EN);
  document.content.personal.photo = undefined;
  document.content.experience[0].description = `${'Detailed responsibility and measurable outcome. '.repeat(50)}LONG_CONTENT_END_MARKER`;
  document.content.experience[0].achievements.push({ id: 'achievement-long', text: 'Additional repeated achievement.' });
  document.content.education[1].description = undefined;
  document.content.publications[0].url = undefined;
  const { xml } = await docxParts(document);
  const text = textFromXml(xml);
  assert.ok(text.includes('LONG_CONTENT_END_MARKER'));
  assert.ok(text.includes('Additional repeated achievement.'));
  assert.ok(text.includes('University of Michigan'));
});
