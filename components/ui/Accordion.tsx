'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AccordionItem({ question, answer, isOpen = false, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 py-4 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-start text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        aria-expanded={isOpen}
      >
        <span className="pe-4">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200',
            isOpen && 'rotate-180 text-blue-600 dark:text-blue-400'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed ps-0 pe-4">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

