"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const { t } = useT();

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div
        className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 md:px-16 md:py-24 flex flex-col items-center text-center gap-8 transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-primary-foreground/10" />

        <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground text-balance max-w-2xl">
          {t.cta.title}
        </h2>
        <p className="relative text-lg text-primary-foreground/80 max-w-xl leading-relaxed">
          {t.cta.description}
        </p>
        <div
          className="relative flex flex-col sm:flex-row gap-4 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "200ms",
          }}
        >
          <Link
            href="/sign-up"
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "text-base px-8 h-12 bg-primary-foreground text-primary hover:bg-primary-foreground/90",
            })}
          >
            {t.cta.joinAsHost}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/sign-up"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "text-base px-8 h-12 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent",
            })}
          >
            {t.cta.joinAsGuest}
          </Link>
        </div>
      </div>
    </section>
  );
}
