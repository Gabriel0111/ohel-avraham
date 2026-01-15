import Hero from "@/app/(shared-layout)/_components/hero";
import PurposeSection from "@/app/(shared-layout)/_components/purpose-section";
import HowItWorks from "@/app/(shared-layout)/_components/how-it-works";
import HostsGuestsSection from "@/app/(shared-layout)/_components/host-guests-section";
import CommunityStats from "@/app/(shared-layout)/_components/community-stats";
import CitiesSection from "@/app/(shared-layout)/_components/cities-section";
import TrustSection from "@/app/(shared-layout)/_components/trust-section";
import FinalCTA from "@/app/(shared-layout)/_components/final-cta";

const Index = () => {
  return (
    <main>
      <Hero />
      <PurposeSection />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <HostsGuestsSection />
      <section id="communities">
        <CommunityStats />
      </section>
      <CitiesSection />
      <section id="about">
        <TrustSection />
      </section>
      <FinalCTA />
    </main>
  );
};

export default Index;
