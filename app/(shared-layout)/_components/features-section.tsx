"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Shield, Heart, Globe, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n/context";

const featureIcons: ReactNode[] = [
  <Shield key="0" className="size-6" />,
  <Heart key="1" className="size-6" />,
  <Globe key="2" className="size-6" />,
  <Users key="3" className="size-6" />,
];

function FeatureCard({
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
      className="group flex flex-col gap-4 p-6 rounded-xl transition-all duration-700 hover:bg-accent/50"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { t } = useT();

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="flex flex-col items-center gap-4 mb-16">
        <span
          className="text-sm font-semibold uppercase tracking-widest text-primary transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {t.features.sectionLabel}
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          {t.features.sectionTitle}
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.features.items.map((feature, i) => (
          <FeatureCard
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
