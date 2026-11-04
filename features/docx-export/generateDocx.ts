import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Tab,
  TabStopType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import type { ResumeExportModel, ResolvedResumeSection } from '../export/resolveResumeExport.ts';
import { ResumeDocumentSchema, type PaperSize, type ResumeLanguage } from '../../schemas/resume.schema.ts';
import { resolveResumeExportModel } from '../export/resolveResumeExport.ts';

type ResumeDocument = ResumeExportModel['document'];
type ResumeDesign = ResumeDocument['design'];
type TextOptions = { bold?: boolean; italic?: boolean; color?: string; size?: number };
type PhotoData = { data: Uint8Array; type: 'png' | 'jpg'; width: number; height: number };

function convertMillimetersToTwip(value: number): number {
  return Math.round((value * 1440) / 25.4);
}

const labels: Record<ResumeLanguage, Record<string, string>> = {
  en: {
    summary: 'Professional Summary', experience: 'Work Experience', education: 'Education', skills: 'Skills',
    projects: 'Projects', certifications: 'Certifications', languages: 'Languages', awards: 'Awards',
    volunteering: 'Volunteering', publications: 'Publications', interests: 'Interests', present: 'Present',
  },
  fr: {
    summary: 'Profil professionnel', experience: 'Expérience professionnelle', education: 'Formation', skills: 'Compétences',
    projects: 'Projets', certifications: 'Certifications', languages: 'Langues', awards: 'Distinctions',
    volunteering: 'Bénévolat', publications: 'Publications', interests: 'Centres d’intérêt', present: 'En cours',
  },
  es: {
    summary: 'Perfil profesional', experience: 'Experiencia profesional', education: 'Educación', skills: 'Habilidades',
    projects: 'Proyectos', certifications: 'Certificaciones', languages: 'Idiomas', awards: 'Premios',
    volunteering: 'Voluntariado', publications: 'Publicaciones', interests: 'Intereses', present: 'Actualidad',
  },
  ar: {
    summary: 'الملخص المهني', experience: 'الخبرة المهنية', education: 'التعليم', skills: 'المهارات',
    projects: 'المشاريع', certifications: 'الشهادات', languages: 'اللغات', awards: 'الجوائز',
    volunteering: 'العمل التطوعي', publications: 'المنشورات', interests: 'الاهتمامات', present: 'حتى الآن',
  },
  ur: {
    summary: 'پیشہ ورانہ خلاصہ', experience: 'پیشہ ورانہ تجربہ', education: 'تعلیم', skills: 'مہارتیں',
    projects: 'منصوبے', certifications: 'سرٹیفیکیشنز', languages: 'زبانیں', awards: 'اعزازات',
    volunteering: 'رضاکارانہ کام', publications: 'اشاعتیں', interests: 'دلچسپیاں', present: 'تاحال جاری',
  },
};

const noTableBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
} as const;

function color(value: string): string {
  return value.replace(/^#/, '').toUpperCase();
}

function fontFor(design: ResumeDesign) {
  const name = design.fontFamily.trim() || 'Arial';
  return { ascii: name, hAnsi: name, eastAsia: name, cs: name };
}

function paragraphBase(design: ResumeDesign, extra: Record<string, unknown> = {}) {
  const rtl = design.direction === 'rtl';
  return {
    bidirectional: rtl,
    alignment: rtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    ...extra,
  };
}

function run(design: ResumeDesign, text: string, options: TextOptions = {}) {
  return new TextRun({
    text,
    font: fontFor(design),
    size: Math.round((options.size ?? design.fontSizes.body) * 2),
    color: options.color ?? '263445',
    bold: options.bold,
    italics: options.italic,
    rightToLeft: design.direction === 'rtl',
    sizeComplexScript: Math.round((options.size ?? design.fontSizes.body) * 2),
    boldComplexScript: options.bold,
    italicsComplexScript: options.italic,
    language: { bidirectional: design.language, value: design.language },
  });
}

function paragraph(design: ResumeDesign, text: string, options: TextOptions & { before?: number; after?: number; keepNext?: boolean; keepLines?: boolean } = {}) {
  return new Paragraph({
    ...paragraphBase(design, {
      spacing: { before: options.before ?? 0, after: options.after ?? 80, line: 276 },
      keepNext: options.keepNext,
      keepLines: options.keepLines,
      widowControl: true,
    }),
    children: [run(design, text, options)],
  });
}

function paragraphsForText(design: ResumeDesign, value: string, options: TextOptions & { after?: number } = {}): Paragraph[] {
  return value.split(/\r\n|\n|\r/).map((line, index, lines) => paragraph(design, line || ' ', {
    ...options,
    after: index === lines.length - 1 ? options.after ?? 90 : 30,
    keepLines: false,
  }));
}

function linkRun(design: ResumeDesign, label: string, url: string): ExternalHyperlink {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({
      text: label,
      font: fontFor(design),
      size: Math.round(design.fontSizes.small * 2),
      color: '315C84',
      underline: { color: '315C84' },
      rightToLeft: design.direction === 'rtl',
      sizeComplexScript: Math.round(design.fontSizes.small * 2),
    })],
  });
}

function sectionHeading(design: ResumeDesign, title: string): Paragraph {
  const accent = color(design.accentColor);
  return new Paragraph({
    ...paragraphBase(design, {
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 230, after: 90, line: 260 },
      keepNext: true,
      keepLines: true,
      border: { bottom: { color: accent, size: 8, space: 5, style: BorderStyle.SINGLE } },
    }),
    children: [new TextRun({
      text: title,
      bold: true,
      boldComplexScript: true,
      allCaps: design.direction === 'ltr' && /^[\x00-\x7F]+$/.test(title),
      font: fontFor(design),
      size: Math.round(design.fontSizes.heading * 2),
      sizeComplexScript: Math.round(design.fontSizes.heading * 2),
      color: accent,
      rightToLeft: design.direction === 'rtl',
      language: { bidirectional: design.language, value: design.language },
    })],
  });
}

function entryHeading(design: ResumeDesign, title: string, date?: string): Paragraph {
  const rtl = design.direction === 'rtl';
  const dimensions = paperDimensions(design.paperSize);
  const textWidth = dimensions.width - design.margins.left - design.margins.right;
  return new Paragraph({
    ...paragraphBase(design, {
      spacing: { before: 100, after: 30, line: 260 },
      keepNext: true,
      keepLines: true,
      tabStops: date ? [{ type: rtl ? TabStopType.END : TabStopType.RIGHT, position: convertMillimetersToTwip(textWidth) }] : undefined,
    }),
    children: [
      run(design, title, { bold: true, color: '172B42', size: design.fontSizes.body }),
      ...(date ? [new TextRun({ children: [new Tab()] }), run(design, date, { color: '607084', size: design.fontSizes.small })] : []),
    ],
  });
}

function metaLine(design: ResumeDesign, values: Array<string | undefined>): Paragraph | undefined {
  const text = values.filter((value): value is string => Boolean(value?.trim())).join('  ·  ');
  return text ? paragraph(design, text, { size: design.fontSizes.small, color: '596A7D', after: 45, keepNext: true }) : undefined;
}

function dateRange(start?: string, end?: string, current?: boolean, language: ResumeLanguage = 'en') {
  return [start, current ? labels[language].present : end].filter(Boolean).join(' — ');
}

function appendDescription(children: Paragraph[], design: ResumeDesign, value?: string) {
  if (value) children.push(...paragraphsForText(design, value, { color: '334155', after: 70 }));
}

function appendBullet(children: Paragraph[], design: ResumeDesign, value: string) {
  children.push(new Paragraph({
    ...paragraphBase(design, { spacing: { before: 0, after: 35, line: 276 }, keepLines: true, widowControl: true }),
    bullet: { level: 0 },
    children: [run(design, value, { color: '334155' })],
  }));
}

function appendLink(children: Paragraph[], design: ResumeDesign, label: string, url: string, options: { before?: number; after?: number } = {}) {
  children.push(new Paragraph({
    ...paragraphBase(design, { spacing: { before: options.before ?? 0, after: options.after ?? 70, line: 276 }, keepLines: true }),
    children: [linkRun(design, label, url)],
  }));
}

function appendSection(children: Paragraph[], section: ResolvedResumeSection, model: ResumeExportModel) {
  const { design } = model.document;
  const language = design.language;
  const title = section.kind === 'custom' ? section.section.title : section.kind === 'summary' ? labels[language].summary : labels[language][section.kind];
  children.push(sectionHeading(design, title));

  switch (section.kind) {
    case 'summary':
      appendDescription(children, design, section.content);
      return;
    case 'experience':
      for (const entry of section.entries) {
        const date = dateRange(entry.startDate, entry.endDate, entry.isCurrent, language);
        children.push(entryHeading(design, entry.jobTitle, date));
        const meta = metaLine(design, [entry.employer, entry.location]);
        if (meta) children.push(meta);
        appendDescription(children, design, entry.description);
        for (const achievement of entry.achievements) appendBullet(children, design, achievement.text);
      }
      return;
    case 'education':
      for (const entry of section.entries) {
        const date = dateRange(entry.startDate, entry.endDate);
        children.push(entryHeading(design, entry.institution, date));
        const meta = metaLine(design, [entry.degree, entry.fieldOfStudy, entry.location]);
        if (meta) children.push(meta);
        if (entry.grade) children.push(paragraph(design, entry.grade, { size: design.fontSizes.small, color: '596A7D', after: 50 }));
        appendDescription(children, design, entry.description);
      }
      return;
    case 'skills':
      for (const entry of section.entries) {
        const detail = [entry.category, entry.proficiency].filter(Boolean).join(' · ');
        children.push(paragraph(design, [entry.name, detail ? `— ${detail}` : undefined].filter(Boolean).join('  '), { after: 50, keepLines: true }));
      }
      return;
    case 'projects':
      for (const entry of section.entries) {
        const date = dateRange(entry.startDate, entry.endDate);
        children.push(entryHeading(design, entry.title, date));
        const meta = metaLine(design, [entry.role]);
        if (meta) children.push(meta);
        appendDescription(children, design, entry.description);
        if (entry.technologies.length) {
          const technologyLine = metaLine(design, [`Technologies: ${entry.technologies.join(', ')}`]);
          if (technologyLine) children.push(technologyLine);
        }
        if (entry.url) appendLink(children, design, entry.url, entry.url);
      }
      return;
    case 'certifications':
      for (const entry of section.entries) {
        children.push(entryHeading(design, entry.name, entry.date));
        const meta = metaLine(design, [entry.issuer, entry.credentialId]);
        if (meta) children.push(meta);
        if (entry.url) appendLink(children, design, entry.url, entry.url);
      }
      return;
    case 'languages':
      for (const entry of section.entries) {
        children.push(paragraph(design, [entry.name, entry.proficiency].filter(Boolean).join('  ·  '), { after: 55, keepLines: true }));
      }
      return;
    case 'awards':
      for (const entry of section.entries) {
        children.push(entryHeading(design, entry.title, entry.date));
        const meta = metaLine(design, [entry.issuer]);
        if (meta) children.push(meta);
        appendDescription(children, design, entry.description);
      }
      return;
    case 'volunteering':
      for (const entry of section.entries) {
        children.push(entryHeading(design, entry.role, dateRange(entry.startDate, entry.endDate, entry.isCurrent, language)));
        const meta = metaLine(design, [entry.organization, entry.location]);
        if (meta) children.push(meta);
        appendDescription(children, design, entry.description);
        for (const achievement of entry.achievements) appendBullet(children, design, achievement.text);
      }
      return;
    case 'publications':
      for (const entry of section.entries) {
        children.push(entryHeading(design, entry.title, entry.date));
        const meta = metaLine(design, [entry.publisher]);
        if (meta) children.push(meta);
        appendDescription(children, design, entry.description);
        if (entry.url) appendLink(children, design, entry.url, entry.url);
      }
      return;
    case 'interests':
      for (const entry of section.entries) {
        children.push(paragraph(design, [entry.name, entry.description].filter(Boolean).join('  ·  '), { after: 55, keepLines: true }));
      }
      return;
    case 'custom':
      for (const entry of section.section.entries) {
        children.push(entryHeading(design, entry.title || entry.subtitle || section.section.title, entry.date));
        const meta = metaLine(design, [entry.subtitle, entry.location]);
        if (meta) children.push(meta);
        appendDescription(children, design, entry.description);
        for (const detail of entry.details) appendBullet(children, design, detail);
      }
  }

}

function imageType(data: Uint8Array): 'png' | 'jpg' | 'webp' | undefined {
  if (data.length >= 8 && data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) return 'png';
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'jpg';
  if (data.length >= 12 && String.fromCharCode(...data.slice(0, 4)) === 'RIFF' && String.fromCharCode(...data.slice(8, 12)) === 'WEBP') return 'webp';
  return undefined;
}

function rasterDimensions(data: Uint8Array, type: 'png' | 'jpg'): { width: number; height: number } {
  if (type === 'png' && data.length >= 24) {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }
  if (type === 'jpg') {
    const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    let offset = 2;
    while (offset + 8 < data.length) {
      if (data[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      while (data[offset] === 0xff) offset += 1;
      const marker = data[offset];
      const length = data[offset + 1] * 256 + data[offset + 2];
      if (frameMarkers.has(marker)) {
        const height = data[offset + 4] * 256 + data[offset + 5];
        const width = data[offset + 6] * 256 + data[offset + 7];
        return { width, height };
      }
      if (length < 2) break;
      offset += length + 1;
    }
  }
  return { width: 0, height: 0 };
}

async function photoFromSource(src: string): Promise<PhotoData | undefined> {
  try {
    const response = await fetch(src);
    if (!response.ok) return undefined;
    const bytes = new Uint8Array(await response.arrayBuffer());
    const sourceType = imageType(bytes);
    if (!sourceType || bytes.length > 8 * 1024 * 1024) return undefined;
    if ((sourceType === 'png' && bytes.length < 24) || (sourceType === 'jpg' && bytes.length < 10)) return undefined;

    if (sourceType !== 'webp') {
      let { width, height } = rasterDimensions(bytes, sourceType);
      if (typeof createImageBitmap === 'function') {
        const bitmap = await createImageBitmap(new Blob([bytes]));
        width = bitmap.width;
        height = bitmap.height;
        bitmap.close();
      }
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return undefined;
      return { data: bytes, type: sourceType, width, height };
    }

    if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return undefined;
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/webp' }));
    const scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) {
      bitmap.close();
      return undefined;
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!png) return undefined;
    return { data: new Uint8Array(await png.arrayBuffer()), type: 'png', width: canvas.width, height: canvas.height };
  } catch {
    // A missing, inaccessible, malformed, or unsupported photo should not block resume export.
    return undefined;
  }
}

function photoRun(photo: PhotoData, alt: string): ImageRun {
  const maxWidth = 76;
  const maxHeight = 76;
  const scale = Math.min(maxWidth / photo.width, maxHeight / photo.height);
  return new ImageRun({
    data: photo.data,
    type: photo.type,
    transformation: {
      width: Math.max(1, Math.round(photo.width * scale)),
      height: Math.max(1, Math.round(photo.height * scale)),
    },
    altText: { name: alt, description: alt, title: alt },
  });
}

function contactItems(model: ResumeExportModel) {
  const { personal } = model.document.content;
  const parts: Array<{ label: string; url?: string }> = [];
  if (personal.email) parts.push({ label: personal.email, url: `mailto:${personal.email}` });
  if (personal.phone) parts.push({ label: personal.phone, url: `tel:${personal.phone.replace(/[^+\d]/g, '')}` });
  if (personal.location) parts.push({ label: personal.location });
  if (personal.website) parts.push({ label: personal.website, url: personal.website });
  if (personal.linkedIn) parts.push({ label: personal.linkedIn, url: personal.linkedIn });
  if (personal.gitHub) parts.push({ label: personal.gitHub, url: personal.gitHub });
  return parts;
}

function identityParagraphs(model: ResumeExportModel): Paragraph[] {
  const { personal } = model.document.content;
  const { design } = model.document;
  const children: Paragraph[] = [new Paragraph({
    ...paragraphBase(design, { heading: HeadingLevel.HEADING_1, spacing: { before: 0, after: 35, line: 300 }, keepNext: true }),
    children: [new TextRun({
      text: personal.fullName,
      bold: true,
      boldComplexScript: true,
      font: fontFor(design),
      size: Math.round(design.fontSizes.name * 2),
      sizeComplexScript: Math.round(design.fontSizes.name * 2),
      color: color(design.accentColor),
      rightToLeft: design.direction === 'rtl',
      language: { bidirectional: design.language, value: design.language },
    })],
  })];

  if (personal.professionalTitle) children.push(paragraph(design, personal.professionalTitle, {
    size: design.fontSizes.body,
    color: '39465B',
    bold: true,
    after: 0,
    keepLines: true,
  }));
  return children;
}

function contactParagraphs(model: ResumeExportModel): Paragraph[] {
  const { design } = model.document;
  const alignment = design.direction === 'rtl' ? AlignmentType.LEFT : AlignmentType.RIGHT;
  return contactItems(model).map((item, index, items) => new Paragraph({
    ...paragraphBase(design, {
      alignment,
      spacing: { before: 0, after: index === items.length - 1 ? 0 : 28, line: 250 },
      keepLines: true,
      widowControl: true,
    }),
    children: [item.url
      ? linkRun(model.document.design, item.label, item.url)
      : run(design, item.label, { color: '596A7D', size: design.fontSizes.small })],
  }));
}

function headerCellBorders(accent: string) {
  return {
    ...noTableBorders,
    bottom: { style: BorderStyle.SINGLE, size: 8, color: accent },
  };
}

function createHeaderTable(model: ResumeExportModel, photo?: PhotoData): Table {
  const { personal } = model.document.content;
  const { design } = model.document;
  const dimensions = paperDimensions(design.paperSize);
  const contentWidth = convertMillimetersToTwip(dimensions.width - design.margins.left - design.margins.right);
  const contactWidth = Math.round(contentWidth * 0.42);
  const identityWidth = contentWidth - contactWidth;
  const accent = color(design.accentColor);
  const cellMargins = { top: 0, bottom: 150, left: 70, right: 70 };
  let identityContent: Array<Paragraph | Table> = identityParagraphs(model);

  if (photo) {
    const photoWidth = convertMillimetersToTwip(25);
    const identityContentWidth = identityWidth - cellMargins.left - cellMargins.right;
    const textWidth = identityContentWidth - photoWidth;
    const image = new Paragraph({
      ...paragraphBase(design, { alignment: design.direction === 'rtl' ? AlignmentType.RIGHT : AlignmentType.LEFT, spacing: { before: 0, after: 0 } }),
      children: [photoRun(photo, personal.photo?.altText || personal.fullName)],
    });
    const imageCell = new TableCell({
      width: { size: photoWidth, type: WidthType.DXA },
      verticalAlign: 'center',
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      borders: noTableBorders,
      children: [image],
    });
    const identityTextCell = new TableCell({
      width: { size: textWidth, type: WidthType.DXA },
      verticalAlign: 'center',
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      borders: noTableBorders,
      children: identityParagraphs(model),
    });
    identityContent = [new Table({
      rows: [new TableRow({ children: [imageCell, identityTextCell], cantSplit: true })],
      width: { size: identityContentWidth, type: WidthType.DXA },
      columnWidths: [photoWidth, textWidth],
      layout: TableLayoutType.FIXED,
      visuallyRightToLeft: design.direction === 'rtl',
      borders: noTableBorders,
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    })];
  }

  const identityCell = new TableCell({
    width: { size: identityWidth, type: WidthType.DXA },
    verticalAlign: 'center',
    margins: cellMargins,
    borders: headerCellBorders(accent),
    children: identityContent,
  });
  const contacts = contactParagraphs(model);
  const contactCell = new TableCell({
    width: { size: contactWidth, type: WidthType.DXA },
    verticalAlign: 'center',
    margins: cellMargins,
    borders: headerCellBorders(accent),
    children: contacts.length ? contacts : [new Paragraph({ children: [new TextRun(' ')] })],
  });
  const row = new TableRow({ children: [identityCell, contactCell], cantSplit: true });
  return new Table({
    rows: [row],
    width: { size: contentWidth, type: WidthType.DXA },
    columnWidths: [identityWidth, contactWidth],
    layout: TableLayoutType.FIXED,
    visuallyRightToLeft: design.direction === 'rtl',
    borders: headerCellBorders(accent),
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
  });
}

function paperDimensions(paperSize: PaperSize) {
  return paperSize === 'a4' ? { width: 210, height: 297 } : { width: 215.9, height: 279.4 };
}

/** Build an editable Word document directly from the canonical, resolved export model. */
export async function generateResumeDocx(model: ResumeExportModel): Promise<Blob> {
  const resume = ResumeDocumentSchema.parse(model.document);
  const resolvedModel = resolveResumeExportModel(resume);
  const sections = resolvedModel.sections;
  const { design } = resume;
  const dimensions = paperDimensions(design.paperSize);
  const pageWidth = convertMillimetersToTwip(dimensions.width);
  const pageHeight = convertMillimetersToTwip(dimensions.height);
  const photo = resume.content.personal.photo?.src ? await photoFromSource(resume.content.personal.photo.src) : undefined;
  const children: Array<Paragraph | Table> = [];

  children.push(createHeaderTable(resolvedModel, photo));
  for (const section of sections) {
    const sectionParagraphs: Paragraph[] = [];
    appendSection(sectionParagraphs, section, resolvedModel);
    children.push(...sectionParagraphs);
  }

  const doc = new Document({
    creator: 'CVMaker',
    title: `${resume.content.personal.fullName} Resume`,
    description: 'Editable resume generated from the CVMaker canonical resume document.',
    styles: {
      default: {
        document: { run: { font: fontFor(design), size: Math.round(design.fontSizes.body * 2), color: '263445' } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: pageWidth, height: pageHeight },
          margin: {
            top: convertMillimetersToTwip(design.margins.top),
            right: convertMillimetersToTwip(design.margins.right),
            bottom: convertMillimetersToTwip(design.margins.bottom),
            left: convertMillimetersToTwip(design.margins.left),
          },
        },
      },
      children,
    }],
  });
  return Packer.toBlob(doc);
}
