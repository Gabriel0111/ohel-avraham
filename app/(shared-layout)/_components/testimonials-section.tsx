"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Star } from "lucide-react";
import { useT } from "@/lib/i18n/context";

function TestimonialCard({
  name,
  role,
  quote,
  index,
  isVisible,
}: {
  name: string;
  role: string;
  quote: string;
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-5 p-8 rounded-2xl bg-card border border-border transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 200}ms`,
      }}
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-foreground leading-relaxed italic">
        {'"' + quote + '"'}
      </p>
      <div className="mt-auto pt-4 border-t border-border">
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
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
          {t.testimonials.sectionLabel}
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          {t.testimonials.sectionTitle}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {t.testimonials.items.map((item, i) => (
          <TestimonialCard
            key={i}
            name={item.name}
            role={item.role}
            quote={item.quote}
            index={i}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
