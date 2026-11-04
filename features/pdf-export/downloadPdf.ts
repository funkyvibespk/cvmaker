import type { PaperSize } from '../../schemas/resume.schema.ts';
import { getResumePageRule } from './printLayout';

export function downloadResumePdf(
  paperSize: PaperSize,
  fullName?: string,
  afterPrint?: () => void,
): void {
  if (typeof window === 'undefined') return;

  const originalTitle = document.title;
  const cleanName = fullName ? fullName.trim().replace(/\s+/g, '_') : 'Resume';
  document.title = `${cleanName}_CV`;

  let appShell = document.getElementById('resume-pdf-document');
  while (appShell?.parentElement && appShell.parentElement !== document.body) {
    appShell = appShell.parentElement;
  }
  appShell?.classList.add('resume-pdf-shell');

  const printStyle = document.createElement('style');
  printStyle.dataset.resumePrintPage = 'true';
  printStyle.textContent = getResumePageRule(paperSize);
  document.head.appendChild(printStyle);
  document.documentElement.classList.add('resume-pdf-print');

  const cleanup = () => {
    printStyle.remove();
    document.documentElement.classList.remove('resume-pdf-print');
    appShell?.classList.remove('resume-pdf-shell');
    document.title = originalTitle;
    window.removeEventListener('afterprint', cleanup);
    afterPrint?.();
  };

  window.addEventListener('afterprint', cleanup, { once: true });
  window.print();
}

