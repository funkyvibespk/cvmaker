export function downloadResumePdf(fullName?: string): void {
  if (typeof window === 'undefined') return;

  const originalTitle = document.title;
  const cleanName = fullName ? fullName.trim().replace(/\s+/g, '_') : 'Resume';
  document.title = `${cleanName}_CV`;

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}

