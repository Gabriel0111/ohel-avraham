"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah L.",
    role: "Guest",
    quote:
      "I was new to the city and didn't know anyone. Through Ohel Avraham, I found a family that welcomed me like their own. It changed my Shabbat completely.",
  },
  {
    name: "David & Miriam K.",
    role: "Hosts",
    quote:
      "We have extra seats at our table every week. Now those seats are filled with wonderful people we would never have met otherwise. It enriches our Shabbat.",
  },
  {
    name: "Yonatan R.",
    role: "Guest",
    quote:
      "As a student far from home, Shabbat could feel lonely. This platform gave me a community. Now I look forward to every Friday night.",
  },
];

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
          <Star
            key={i}
            className="size-4 fill-primary text-primary"
          />
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
          Testimonials
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          Stories from our community
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={t.name}
            name={t.name}
            role={t.role}
            quote={t.quote}
            index={i}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
