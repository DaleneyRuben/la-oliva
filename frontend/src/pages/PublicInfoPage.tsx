import { ContactSection } from '@/features/public-info/components/ContactSection';
import { DailyPlanSection } from '@/features/public-info/components/DailyPlanSection';
import { HowItWorksSection } from '@/features/public-info/components/HowItWorksSection';
import { IncludesSection } from '@/features/public-info/components/IncludesSection';
import { PlanTypesSection } from '@/features/public-info/components/PlanTypesSection';
import { PricingSection } from '@/features/public-info/components/PricingSection';
import { PublicInfoFooter } from '@/features/public-info/components/PublicInfoFooter';
import { PublicInfoHero } from '@/features/public-info/components/PublicInfoHero';
import { SectionNav } from '@/features/public-info/components/SectionNav';

export function PublicInfoPage() {
  return (
    <main className="min-h-screen scroll-smooth bg-public-cream font-public-body text-public-body">
      <PublicInfoHero />
      <SectionNav />
      <DailyPlanSection />
      <IncludesSection />
      <PlanTypesSection />
      <PricingSection />
      <HowItWorksSection />
      <ContactSection />
      <PublicInfoFooter />
    </main>
  );
}
