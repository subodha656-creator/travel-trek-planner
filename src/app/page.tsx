'use client'
import CTASection from "@/components/layout/cta-section";
import HeroPage from "@/components/layout/hero-page";
import HowItWorks from "@/components/layout/how-it-works-section";
import PopularDestinations from "@/components/layout/popular-destinations";

export default function Home() {
  return (
    <>
      <HeroPage />
      <HowItWorks />
      <CTASection />
      <PopularDestinations/>
    </>
  );
}
