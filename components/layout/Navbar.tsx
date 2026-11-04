'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Menu, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18nStore } from '@/features/internationalization/store';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, dir } = useI18nStore();

  const navLinks = [
    { href: '#templates', label: t.nav.templates },
    { href: '#how-it-works', label: t.nav.howItWorks },
    { href: '#features', label: t.nav.features },
    { href: '#faq', label: t.nav.faq },
  ];

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/90">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg p-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-white dark:text-slate-950">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                {t.nav.brand}
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                {t.nav.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-slate-950 dark:hover:text-white focus:outline-none focus-visible:text-blue-600"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions: Language Selector & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSelector />
            <Link href="/builder">
              <Button size="sm" className="font-semibold shadow-sm">
                <span>{t.nav.createResume}</span>
                <ArrowIcon className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <LanguageSelector />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-5 shadow-lg sm:hidden dark:border-slate-800 dark:bg-slate-950 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-700 transition hover:text-blue-600 dark:text-slate-200"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <Link href="/builder" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button className="w-full justify-center">
                  <span>{t.nav.createResume}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

