"use client";

import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

// Candlelight tones: violet (host / primary) + amber (guest / warmth).
export type SparkTone = "violet" | "amber";

const TONE_CLASS: Record<SparkTone, string> = {
  violet: "text-violet-500",
  amber: "text-amber-400",
};

export type Spark = {
  top: string;
  left: string;
  size: number;
  delay?: number;
  duration?: number;
  tone?: SparkTone;
};

// A few candlelight motes scattered over a relative container. Decorative and
// purely ambient — hidden from a11y, and frozen under reduced-motion (handled
// by the .animate-twinkle rule in globals.css).
export function Sparkles({
  sparks,
  className,
}: {
  sparks: Spark[];
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {sparks.map((s, i) => (
        <Sparkle
          key={i}
          fill="currentColor"
          strokeWidth={0}
          className={cn(
            TONE_CLASS[s.tone ?? "violet"],
            "absolute animate-twinkle drop-shadow-2xl will-change-transform",
            "drop-shadow-[0_0_6px_currentColor]",
            TONE_CLASS[s.tone ?? "violet"],
          )}
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay ?? 0}s`,
            animationDuration: s.duration ? `${s.duration}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}
