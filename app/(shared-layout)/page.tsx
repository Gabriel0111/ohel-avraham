"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HeroSection } from "./_components/hero-section";
import { StatsSection } from "./_components/stats-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { FeaturesSection } from "./_components/features-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTASection } from "./_components/cta-section";
import { Footer } from "./_components/footer";

export default function Home() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser?.role === "user") router.replace("/complete-registration");
  }, [currentUser]);

  return (
    <main>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
