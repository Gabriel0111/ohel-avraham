import { HeroSection } from "./_components/hero-section";
import { ManifestoSection } from "./_components/manifesto-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { FeaturesSection } from "./_components/features-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTASection } from "./_components/cta-section";
import { Footer } from "./_components/footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ManifestoSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
