"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { UserPlus, CalendarHeart, Utensils } from "lucide-react";
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n/context";

const stepIcons: ReactNode[] = [
  <UserPlus key="0" className="size-7" />,
  <CalendarHeart key="1" className="size-7" />,
  <Utensils key="2" className="size-7" />,
];

function StepCard({
  icon,
  title,
  description,
  index,
  isVisible,
  stepLabel,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
  stepLabel: string;
}) {
  return (
    <div
      className="flex flex-col items-center text-center gap-5 p-8 rounded-2xl bg-card border border-border transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 200}ms`,
      }}
    >
      <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {stepLabel} {index + 1}
        </span>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export function HowItWorksSection() {
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
          {t.howItWorks.sectionLabel}
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          {t.howItWorks.sectionTitle}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {t.howItWorks.steps.map((step, i) => (
          <StepCard
            key={i}
            icon={stepIcons[i]}
            title={step.title}
            description={step.description}
            index={i}
            isVisible={isVisible}
            stepLabel={t.howItWorks.step}
          />
        ))}
      </div>
    </section>
  );
}
