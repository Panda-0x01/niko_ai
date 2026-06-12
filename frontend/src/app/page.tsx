import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { BenefitsSection } from "@/components/landing/benefits";
import { TechnologySection } from "@/components/landing/technology";
import { FAQSection } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta";
import { FooterSection } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TechnologySection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
