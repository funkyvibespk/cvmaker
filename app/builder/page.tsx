'use client';

import { Suspense } from 'react';
import { CoreResumeEditor } from '@/features/resume-editor/CoreResumeEditor';

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading Resume Creation Studio...</div>}>
      <CoreResumeEditor />
    </Suspense>
  );
}
