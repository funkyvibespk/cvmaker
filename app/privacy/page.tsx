import React from 'react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="sm">
        <div className="space-y-8">
          <div>
            <Badge variant="success" className="mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero-Storage Guarantee</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 mt-2">Last updated: November 2026</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Core Commitment: Client-Side Privacy</h2>
              <p>
                Our Resume & CV Generator is engineered under a strict <strong>zero-retention, client-side only architecture</strong>.
                When you create, edit, or customize a resume on this site, all data resides exclusively in your browser&apos;s active memory (RAM).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. No Account or Personal Data Collection</h2>
              <p>
                We do not require you to create an account, register, or provide an email address. We do not store, index, sell, or transmit
                your personal contact information, work history, educational records, or uploaded profile photos to remote databases.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Photographs and Media</h2>
              <p>
                Any profile photo you optionally upload is processed locally using browser-standard file APIs. It is never uploaded to any cloud storage or external AI service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Cookies and Advertising</h2>
              <p>
                We do not use tracking cookies for resume content. In the future, third-party advertising partners such as Google AdSense may use cookies to serve non-intrusive advertisements subject to standard web advertising protocols.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Contact</h2>
              <p>
                If you have questions regarding this privacy policy or our architecture, please contact us via our contact page.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}

