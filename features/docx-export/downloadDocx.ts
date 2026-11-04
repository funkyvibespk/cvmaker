import type { ResumeExportModel } from '@/features/export/resolveResumeExport';
import { generateResumeDocx } from './generateDocx';

export async function downloadResumeDocx(model: ResumeExportModel): Promise<void> {
  const blob = await generateResumeDocx(model);
  const cleanName = model.document.content.personal.fullName.trim().replace(/[^\p{L}\p{N}_-]+/gu, '_');
  const fileName = `${cleanName || 'Resume'}_CV.docx`;

  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
