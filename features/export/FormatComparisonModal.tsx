'use client';

import React from 'react';
import { X, FileText, Check, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface FormatComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPdf: () => void;
  onDownloadDocx: () => void;
}

export function FormatComparisonModal({
  isOpen,
  onClose,
  onDownloadPdf,
  onDownloadDocx,
}: FormatComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div>
          <Badge variant="accent" className="mb-2">
            Export Format Guide
          </Badge>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Comparing PDF and Word (.docx) Formats
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Both formats are generated 100% free and client-side from the same resume data. Choose the format best suited for your application:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PDF Format Card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-3 dark:border-blue-900/60 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">Adobe PDF (.pdf)</h4>
              </div>
              <Badge variant="accent" className="text-[10px]">Recommended</Badge>
            </div>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Pixel-Perfect:</strong> Preserves exact template margins, colors, and typography on all devices.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>ATS-Friendly:</strong> Vector text is selectable, indexable, and machine-readable.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Clickable Links:</strong> Embedded LinkedIn, GitHub, and email links work automatically.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button
                size="sm"
                className="w-full justify-center font-semibold"
                onClick={() => {
                  onClose();
                  onDownloadPdf();
                }}
              >
                Export PDF (.pdf)
              </Button>
            </div>
          </div>

          {/* DOCX Format Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">Microsoft Word (.docx)</h4>
              </div>
              <Badge variant="secondary" className="text-[10px]">Editable</Badge>
            </div>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Genuinely Editable:</strong> Real Word paragraphs and headings, not an image.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Recruiter Friendly:</strong> Perfect when agencies or portals explicitly demand .docx files.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Reflowable Layout:</strong> Complex multi-column templates format sequentially in Word to prevent overlapping text boxes.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center font-semibold"
                onClick={() => {
                  onClose();
                  onDownloadDocx();
                }}
              >
                Export Word (.docx)
              </Button>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 text-center border-t border-slate-100 dark:border-slate-800 pt-3">
          Both formats are generated locally in your browser. No files are uploaded to any server.
        </div>
      </div>
    </div>
  );
}

