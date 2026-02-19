"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { UserPlus, CalendarHeart, Utensils } from "lucide-react";
import type { ReactNode } from "react";

const steps: { icon: ReactNode; title: string; description: string }[] = [
  {
    icon: <UserPlus className="size-7" />,
    title: "Create your profile",
    description:
      "Sign up as a host or a guest. Tell us about your preferences, kashrut level, and what makes your Shabbat special.",
  },
  {
    icon: <CalendarHeart className="size-7" />,
    title: "Find a match",
    description:
      "Browse available Shabbat meals in your area, or open your home and let guests find you. We make the connection easy.",
  },
  {
    icon: <Utensils className="size-7" />,
    title: "Share a meal",
    description:
      "Enjoy a warm Shabbat experience together. Build lasting connections and strengthen the community, one meal at a time.",
  },
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
          {"Step " + (index + 1)}
        </span>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

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
          How it works
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          Three simple steps to a meaningful Shabbat
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <StepCard
            key={step.title}
            icon={step.icon}
            title={step.title}
            description={step.description}
            index={i}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
