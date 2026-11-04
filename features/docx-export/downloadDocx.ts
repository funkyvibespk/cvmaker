import { ResumeData } from '@/types/resume';
import { TemplateDefinition } from '@/features/templates/types';
import { generateResumeDocx } from './generateDocx';

export async function downloadResumeDocx(
  data: ResumeData,
  template: TemplateDefinition,
  options?: { paperSize?: 'a4' | 'letter' }
): Promise<void> {
  const blob = await generateResumeDocx(data, template, options);

  const cleanName = data.personal.fullName
    ? data.personal.fullName.trim().replace(/\s+/g, '_')
    : 'Resume';
  const fileName = `${cleanName}_CV.docx`;

  if (typeof window !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

