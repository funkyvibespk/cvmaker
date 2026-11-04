import type { Metadata, Viewport } from 'next';
import { Geist, Noto_Sans_Arabic, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/features/internationalization/I18nProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const notoArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
});

const notoUrdu = Noto_Nastaliq_Urdu({
  variable: '--font-urdu',
  subsets: ['arabic'],
  weight: ['400', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Free Professional Resume & CV Generator | No Sign-Up, ATS-Friendly',
  description:
    'Build job-winning, ATS-friendly resumes in minutes without registration. 100% free, private in-browser editing, and instant vector-crisp PDF download.',
  keywords: [
    'resume builder',
    'cv maker',
    'free resume maker',
    'ats friendly resume',
    'online resume generator',
    'urdu cv maker',
    'arabic cv maker',
    'no signup resume',
  ],
  authors: [{ name: 'ResumeBuilder' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${notoArabic.variable} ${notoUrdu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <I18nProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
