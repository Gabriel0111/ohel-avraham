"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { UserPlus, CalendarHeart, Utensils } from "lucide-react";
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n/context";
import { SectionIntro } from "./section-intro";

const stepIcons: ReactNode[] = [
  <UserPlus key="0" className="size-6" />,
  <CalendarHeart key="1" className="size-6" />,
  <Utensils key="2" className="size-6" />,
];

function StepCard({
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
      className="group relative flex flex-col items-center text-center gap-4 transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 160}ms`,
      }}
    >
      {/* Node: icon in a ring, with the step number anchored to it */}
      <div className="relative z-10 flex items-center justify-center size-14 rounded-full bg-card border-2 border-primary/20 text-primary shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary/45 group-hover:shadow-md">
        {icon}
        <span className="absolute -bottom-1 -end-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold tabular-nums ring-2 ring-background">
          {index + 1}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed max-w-xs text-pretty">
        {description}
      </p>
    </div>
  );
}

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { t } = useT();

  return (
    <section ref={ref} className="py-20 md:py-28">
      <SectionIntro
        title={t.howItWorks.sectionTitle}
        lead={t.howItWorks.lead}
        isVisible={isVisible}
      />

      <div className="relative">
        {/* Journey connector behind the nodes (desktop) — aligned to node centres */}
        <div
          aria-hidden
          className="hidden md:block absolute top-7 inset-x-[16.6%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 transition-opacity duration-700"
          style={{ opacity: isVisible ? 1 : 0, transitionDelay: "300ms" }}
        />
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {t.howItWorks.steps.map((step, i) => (
            <StepCard
              key={i}
              icon={stepIcons[i]}
              title={step.title}
              description={step.description}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
