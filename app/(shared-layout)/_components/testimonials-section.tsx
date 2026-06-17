"use client";

import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Quote, Star } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./section-intro";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

function Stars({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-primary text-primary" />
      ))}
    </div>
  );
}

function Avatar({ name, large }: { name: string; large?: boolean }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      aria-hidden
      className={cn(
        "grid place-items-center shrink-0 rounded-full bg-primary/10 text-primary font-semibold ring-1 ring-primary/15",
        large ? "size-12 text-lg" : "size-10",
      )}
    >
      {initial}
    </div>
  );
}

function Byline({ name, role, large }: { name: string; role: string; large?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} large={large} />
      <div className="min-w-0">
        <p className="font-semibold text-foreground leading-tight truncate">
          {name}
        </p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const reduce = usePrefersReducedMotion();
  const { t } = useT();

  const items = t.testimonials.items;
  const [featured, ...rest] = items;

  // Reveal that enhances an already-visible default: crossfade-only when the
  // user prefers reduced motion, otherwise a short staggered rise.
  const reveal = (index: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: reduce ? "none" : isVisible ? "translateY(0)" : "translateY(32px)",
    transition: reduce
      ? "opacity 400ms ease"
      : "opacity 700ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${index * 120}ms`,
  });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <SectionIntro
        title={t.testimonials.sectionTitle}
        lead={t.testimonials.lead}
        isVisible={isVisible}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-6xl mx-auto">
        {/* Featured testimonial — anchors the section and fills the space */}
        {featured && (
          <article
            className="relative lg:col-span-7 flex flex-col gap-6 p-8 md:p-10 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card to-card overflow-hidden"
            style={reveal(0)}
          >
            <Quote
              aria-hidden
              className="absolute top-6 end-6 size-20 -scale-x-100 text-primary/10"
            />
            <Stars />
            <p className="relative text-xl md:text-2xl font-medium leading-relaxed text-foreground text-pretty">
              {featured.quote}
            </p>
            <div className="mt-auto pt-2">
              <Byline name={featured.name} role={featured.role} large />
            </div>
          </article>
        )}

        {/* Supporting testimonials — stacked, matched to the featured height */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {rest.map((item, i) => (
            <article
              key={i}
              className="flex-1 flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary/25"
              style={reveal(i + 1)}
            >
              <div className="flex items-center justify-between gap-3">
                <Byline name={item.name} role={item.role} />
                <Stars className="shrink-0" />
              </div>
              <p className="text-[15px] leading-relaxed text-foreground text-pretty">
                {item.quote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
