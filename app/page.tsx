import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TemplateShowcase } from '@/components/home/TemplateShowcase';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBanner } from '@/components/home/CtaBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <HowItWorks />
      <TemplateShowcase />
      <FeaturesGrid />
      <FaqSection />
      <CtaBanner />
    </div>
  );
}
