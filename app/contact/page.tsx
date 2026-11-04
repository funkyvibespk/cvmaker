import React from 'react';
import { Container } from '@/components/ui/Container';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="sm">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Contact & Support
            </h1>
            <p className="text-sm text-slate-500 mt-2">Have a question or feedback? We are here to help.</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Mail className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Email Inquiries</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  For general support, feedback, or inquiries:
                </p>
                <p className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  support@cvmaker.app
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200/70 dark:border-slate-800 pt-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Privacy Inquiries</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Our application processes data locally. If you have questions about our zero-retention architecture, reach out anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

