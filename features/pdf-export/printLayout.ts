import type { MarginSettings, PaperSize } from '../../schemas/resume.schema.ts';

export const PAPER_DIMENSIONS_MM: Record<PaperSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
};

export function getResumePageRule(paperSize: PaperSize, margins: MarginSettings): string {
  const { width, height } = PAPER_DIMENSIONS_MM[paperSize];
  const { top, right, bottom, left } = margins;
  return `@page { size: ${width}mm ${height}mm; margin: ${top}mm ${right}mm ${bottom}mm ${left}mm; }`;
}
