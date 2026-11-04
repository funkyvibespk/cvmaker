'use client';

import React, { useState } from 'react';
import { useI18nStore } from '@/features/internationalization/store';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { AccordionItem } from '@/components/ui/Accordion';

export function FaqSection() {
  const { t } = useI18nStore();
  const [openId, setOpenId] = useState<string | null>('q1');

  const faqs = [
    { id: 'q1', question: t.faq.q1, answer: t.faq.a1 },
    { id: 'q2', question: t.faq.q2, answer: t.faq.a2 },
    { id: 'q3', question: t.faq.q3, answer: t.faq.a3 },
    { id: 'q4', question: t.faq.q4, answer: t.faq.a4 },
    { id: 'q5', question: t.faq.q5, answer: t.faq.a5 },
    { id: 'q6', question: t.faq.q6, answer: t.faq.a6 },
  ];

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800">
      <Container size="sm">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="accent" className="px-3 py-1 font-semibold">
            {t.faq.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.faq.title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              id={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

