"use client";

import { motion, useReducedMotion } from "motion/react";
import { useT } from "@/lib/i18n/context";
import { Sparkles } from "./sparkles";

// Replaces the old fabricated-metric band. A new platform has no honest
// "1,200+ meals" to show — so the band carries the brand's reason for being
// (hachnasat orchim) as a single warm statement instead.
export function ManifestoSection() {
  const { t } = useT();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-border">
      {/* Warm centred glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl"
      />

      <Sparkles count={4} className="hidden sm:block" />

      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-32">
        {/* Oversized opening quote glyph */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 select-none font-serif text-[8rem] leading-none text-primary/15 md:text-[11rem]"
        >
          &ldquo;
        </span>

        <motion.blockquote
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-2xl font-semibold leading-snug tracking-tight text-balance text-foreground md:text-3xl lg:text-[2.5rem]"
        >
          {t.manifesto.quote}
        </motion.blockquote>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-sm font-medium text-muted-foreground"
        >
          — {t.manifesto.signature}
        </motion.p>
      </div>
    </section>
  );
}
