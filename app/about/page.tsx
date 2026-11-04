import React from 'react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Heart, Globe, Shield, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="sm">
        <div className="space-y-8">
          <div>
            <Badge variant="accent" className="mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Mission</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              About ResumeBuilder
            </h1>
            <p className="text-sm text-slate-500 mt-2">Empowering job seekers worldwide with free, accessible tools.</p>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Job hunting is already stressful enough without paywalls, deceptive recurring subscriptions, and forced account registrations.
              We built ResumeBuilder to offer a truly free, high-craft, and privacy-respecting alternative.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <Shield className="h-6 w-6 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Zero Cloud Retention</h3>
                <p className="text-xs text-slate-500">Your career data stays on your machine. We never store or monetize your resume content.</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <Globe className="h-6 w-6 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Multilingual & RTL</h3>
                <p className="text-xs text-slate-500">First-class support for English, Urdu, Arabic, French, and Spanish with proper typographic rules.</p>
              </div>
            </div>

            <p>
              Whether you are an entry-level graduate or an executive leader, our templates are engineered to present your skills with dignity, clarity, and precision.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

