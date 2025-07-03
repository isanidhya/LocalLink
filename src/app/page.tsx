import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import WhyUsSection from '@/components/landing/WhyUsSection';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <HowItWorksSection />
      <WhyUsSection />
      <UseCasesSection />
      <TestimonialsSection />
    </div>
  );
}
