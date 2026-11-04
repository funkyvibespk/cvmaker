import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  ExternalHyperlink,
  convertMillimetersToTwip,
  convertInchesToTwip,
} from 'docx';
import { ResumeData } from '@/types/resume';
import { TemplateDefinition } from '@/features/templates/types';

export async function generateResumeDocx(
  data: ResumeData,
  template: TemplateDefinition,
  options?: { paperSize?: 'a4' | 'letter' }
): Promise<Blob> {
  const paper = options?.paperSize || data.paperSize || 'a4';
  const isRtl = data.direction === 'rtl' || data.locale === 'ur' || data.locale === 'ar';
  const primaryColor = template.exportStyles?.primaryHex || '0F172A';
  const secondaryColor = template.exportStyles?.secondaryHex || '475569';

  // Fonts: Fallback to Arial/Traditional Arabic for RTL, otherwise template font
  const defaultFont = isRtl
    ? data.locale === 'ur'
      ? 'Arial'
      : 'Traditional Arabic'
    : template.exportStyles?.fontFamily || 'Calibri';

  // Paper Dimensions
  const pageWidth =
    paper === 'a4'
      ? convertMillimetersToTwip(210)
      : convertInchesToTwip(8.5);
  const pageHeight =
    paper === 'a4'
      ? convertMillimetersToTwip(297)
      : convertInchesToTwip(11);

  const defaultAlignment = isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT;

  const headerAlign =
    template.exportStyles?.headerAlignment === 'center'
      ? AlignmentType.CENTER
      : defaultAlignment;

  const children: Paragraph[] = [];

  // ==========================================
  // 1. HEADER: NAME & JOB TITLE
  // ==========================================
  if (data.personal.fullName) {
    children.push(
      new Paragraph({
        alignment: headerAlign,
        bidirectional: isRtl,
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: data.personal.fullName,
            bold: true,
            size: 36, // 18pt
            color: primaryColor,
            font: defaultFont,
            rightToLeft: isRtl,
          }),
        ],
      })
    );
  }

  if (data.personal.jobTitle) {
    children.push(
      new Paragraph({
        alignment: headerAlign,
        bidirectional: isRtl,
        spacing: { before: 0, after: 140 },
        children: [
          new TextRun({
            text: data.personal.jobTitle,
            bold: true,
            size: 24, // 12pt
            color: secondaryColor,
            font: defaultFont,
            rightToLeft: isRtl,
          }),
        ],
      })
    );
  }

  // ==========================================
  // 2. CONTACT DETAILS LINE
  // ==========================================
  const contactParts: string[] = [];
  if (data.personal.location) contactParts.push(data.personal.location);
  if (data.personal.phone) contactParts.push(data.personal.phone);
  if (data.personal.email) contactParts.push(data.personal.email);
  if (data.personal.website) contactParts.push(data.personal.website);
  if (data.personal.linkedin) contactParts.push(data.personal.linkedin);

  if (contactParts.length > 0) {
    const contactText = isRtl
      ? contactParts.join('  •  ')
      : contactParts.join('  |  ');

    children.push(
      new Paragraph({
        alignment: headerAlign,
        bidirectional: isRtl,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: contactText,
            size: 19, // 9.5pt
            color: '64748B',
            font: defaultFont,
            rightToLeft: isRtl,
          }),
        ],
      })
    );
  }

  // Helper for Section Headings
  const createSectionHeading = (title: string): Paragraph => {
    return new Paragraph({
      alignment: defaultAlignment,
      bidirectional: isRtl,
      spacing: { before: 260, after: 120 },
      border: {
        bottom: {
          color: primaryColor,
          size: 8,
          space: 4,
          style: BorderStyle.SINGLE,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          color: primaryColor,
          font: defaultFont,
          rightToLeft: isRtl,
        }),
      ],
    });
  };

  // ==========================================
  // 3. SUMMARY SECTION
  // ==========================================
  if (data.personal.summary) {
    const summaryTitle = isRtl ? 'خلاصہ' : data.locale === 'fr' ? 'Profil Professionnel' : data.locale === 'es' ? 'Perfil Profesional' : 'Professional Summary';
    children.push(createSectionHeading(summaryTitle));

    children.push(
      new Paragraph({
        alignment: defaultAlignment,
        bidirectional: isRtl,
        spacing: { before: 60, after: 180 },
        children: [
          new TextRun({
            text: data.personal.summary,
            size: 20, // 10pt
            color: '334155',
            font: defaultFont,
            rightToLeft: isRtl,
          }),
        ],
      })
    );
  }

  // ==========================================
  // 4. EXPERIENCE SECTION
  // ==========================================
  if (data.experience && data.experience.length > 0) {
    const expTitle = isRtl ? 'پیشہ ورانہ تجربہ' : data.locale === 'fr' ? 'Expérience Professionnelle' : data.locale === 'es' ? 'Experiencia Laboral' : 'Work Experience';
    children.push(createSectionHeading(expTitle));

    data.experience.forEach((exp) => {
      // Role & Company Line
      children.push(
        new Paragraph({
          alignment: defaultAlignment,
          bidirectional: isRtl,
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: exp.jobTitle,
              bold: true,
              size: 21,
              color: '0F172A',
              font: defaultFont,
              rightToLeft: isRtl,
            }),
            new TextRun({
              text: ` — ${exp.company}`,
              bold: false,
              size: 20,
              color: '334155',
              font: defaultFont,
              rightToLeft: isRtl,
            }),
            new TextRun({
              text: ` (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})`,
              size: 18,
              color: '64748B',
              font: defaultFont,
              rightToLeft: isRtl,
            }),
          ],
        })
      );

      // Bullet points
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((bullet) => {
          if (bullet.trim()) {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                bidirectional: isRtl,
                alignment: defaultAlignment,
                spacing: { before: 20, after: 40 },
                children: [
                  new TextRun({
                    text: bullet.replace(/^[•\-\*]\s*/, ''),
                    size: 19,
                    color: '475569',
                    font: defaultFont,
                    rightToLeft: isRtl,
                  }),
                ],
              })
            );
          }
        });
      }
    });
  }

  // ==========================================
  // 5. EDUCATION SECTION
  // ==========================================
  if (data.education && data.education.length > 0) {
    const eduTitle = isRtl ? 'تعلیمی پس منظر' : data.locale === 'fr' ? 'Formation & Diplômes' : data.locale === 'es' ? 'Educación' : 'Education';
    children.push(createSectionHeading(eduTitle));

    data.education.forEach((edu) => {
      children.push(
        new Paragraph({
          alignment: defaultAlignment,
          bidirectional: isRtl,
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: edu.degree,
              bold: true,
              size: 21,
              color: '0F172A',
              font: defaultFont,
              rightToLeft: isRtl,
            }),
            new TextRun({
              text: ` — ${edu.school}`,
              size: 20,
              color: '334155',
              font: defaultFont,
              rightToLeft: isRtl,
            }),
            new TextRun({
              text: ` (${edu.endDate})`,
              size: 18,
              color: '64748B',
              font: defaultFont,
              rightToLeft: isRtl,
            }),
          ],
        })
      );
    });
  }

  // ==========================================
  // 6. SKILLS SECTION
  // ==========================================
  if (data.skills && data.skills.length > 0) {
    const skillsTitle = isRtl ? 'مہارتیں' : data.locale === 'fr' ? 'Compétences' : data.locale === 'es' ? 'Habilidades' : 'Core Competencies';
    children.push(createSectionHeading(skillsTitle));

    const skillNames = data.skills.map((s) => s.name).join('  •  ');
    children.push(
      new Paragraph({
        alignment: defaultAlignment,
        bidirectional: isRtl,
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: skillNames,
            size: 20,
            color: '334155',
            font: defaultFont,
            rightToLeft: isRtl,
          }),
        ],
      })
    );
  }

  // ==========================================
  // 7. PROJECTS / CERTIFICATIONS (IF PRESENT)
  // ==========================================
  if (data.projects && data.projects.length > 0) {
    const projTitle = isRtl ? 'منصوبہ جات' : data.locale === 'fr' ? 'Projets' : data.locale === 'es' ? 'Proyectos' : 'Projects';
    children.push(createSectionHeading(projTitle));

    data.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          alignment: defaultAlignment,
          bidirectional: isRtl,
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
              size: 20,
              color: '0F172A',
              font: defaultFont,
              rightToLeft: isRtl,
            }),
          ],
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            alignment: defaultAlignment,
            bidirectional: isRtl,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: proj.description,
                size: 19,
                color: '475569',
                font: defaultFont,
                rightToLeft: isRtl,
              }),
            ],
          })
        );
      }
    });
  }

  // Assemble the OpenXML Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: pageWidth,
              height: pageHeight,
            },
            margin: {
              top: convertMillimetersToTwip(14),
              bottom: convertMillimetersToTwip(14),
              left: convertMillimetersToTwip(16),
              right: convertMillimetersToTwip(16),
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

