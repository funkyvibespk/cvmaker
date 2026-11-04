'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, ShieldCheck } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const { t } = useI18nStore();
  const pathname = usePathname();
  const year = 2026;

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${sectionId}`);
      }
    }
  };

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Privacy Statement */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {t.nav.brand}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              {t.footer.tagline}
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{t.footer.zeroStorageNotice}</span>
            </div>
          </div>

          {/* Product Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/templates" className="hover:text-slate-950 dark:hover:text-white transition">
                  {t.nav.templates}
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  onClick={(e) => handleSectionClick(e, 'how-it-works')}
                  className="hover:text-slate-950 dark:hover:text-white transition"
                >
                  {t.nav.howItWorks}
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  onClick={(e) => handleSectionClick(e, 'features')}
                  className="hover:text-slate-950 dark:hover:text-white transition"
                >
                  {t.nav.features}
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  onClick={(e) => handleSectionClick(e, 'faq')}
                  className="hover:text-slate-950 dark:hover:text-white transition"
                >
                  {t.nav.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages (Crucial for AdSense & Privacy) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-slate-950 dark:hover:text-white transition">
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-950 dark:hover:text-white transition">
                  {t.footer.termsOfService}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-950 dark:hover:text-white transition">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-950 dark:hover:text-white transition">
                  {t.footer.contactUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Client-Side Architecture Note */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              {t.footer.zeroStorageNotice}
            </h4>
            <p className="text-xs leading-relaxed text-slate-500">
              {t.footer.disclaimer}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200/80 pt-6 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {year} {t.nav.brand}. {t.footer.rightsReserved}
          </p>
          <p className="flex items-center gap-1">
            <span>Built with privacy in mind</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
