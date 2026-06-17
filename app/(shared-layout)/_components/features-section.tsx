"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Shield, Heart, Globe, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n/context";
import { SectionIntro } from "./section-intro";

const featureIcons: ReactNode[] = [
  <Shield key="0" className="size-5" />,
  <Heart key="1" className="size-5" />,
  <Globe key="2" className="size-5" />,
  <Users key="3" className="size-5" />,
];

function FeatureItem({
  icon,
  title,
  description,
  index,
  isVisible,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      className="group flex items-start gap-4 transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="flex shrink-0 items-center justify-center size-11 rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 group-hover:-rotate-3">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground leading-tight">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-pretty">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { t } = useT();

  return (
    <section ref={ref} className="py-20 md:py-28">
      <SectionIntro
        title={t.features.sectionTitle}
        lead={t.features.lead}
        isVisible={isVisible}
      />

      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl mx-auto">
        {t.features.items.map((feature, i) => (
          <FeatureItem
            key={i}
            icon={featureIcons[i]}
            title={feature.title}
            description={feature.description}
            index={i}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
