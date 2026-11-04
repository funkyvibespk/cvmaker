import React from 'react';
import { Container } from '@/components/ui/Container';

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="sm">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500 mt-2">Last updated: November 2026</p>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this Resume & CV Generator, you agree to be bound by these Terms of Service.
                If you do not agree, you should refrain from using the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Free Educational & Career Use</h2>
              <p>
                This tool is provided completely free of charge for individual job seekers, students, and professionals to author and export resumes for personal career opportunities.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. User Responsibility & Volatile State</h2>
              <p>
                Because no database or cloud account is maintained, you acknowledge that refreshing or closing the browser will clear all in-memory entries. Users are responsible for downloading and archiving their generated PDF documents.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Disclaimer of Warranties</h2>
              <p>
                The service and templates are provided &quot;as is&quot; without warranties of any kind. While our templates are designed in line with standard ATS conventions, we do not guarantee employment or interview offers.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}

