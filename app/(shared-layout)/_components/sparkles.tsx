"use client";

import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

// Candlelight tones: sky (host / primary) + amber (guest / warmth).
export type SparkTone = "sky" | "amber";

const TONE_CLASS: Record<SparkTone, string> = {
  sky: "text-primary",
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

// Shared scatter pattern — the single source of truth for spark placement.
// Call sites just slice it (`count`) and optionally recolour it (`tone`) so we
// don't repeat positional arrays across sections.
const SCATTER: Spark[] = [
  { top: "8%", left: "62%", size: 18, delay: 0, tone: "amber" },
  { top: "20%", left: "22%", size: 12, delay: 1.2, tone: "sky" },
  { top: "46%", left: "88%", size: 14, delay: 0.6, tone: "amber" },
  { top: "72%", left: "12%", size: 16, delay: 1.8, tone: "amber" },
  { top: "82%", left: "70%", size: 11, delay: 0.3, tone: "sky" },
  { top: "38%", left: "4%", size: 10, delay: 2.4, tone: "amber" },
];

// A few candlelight motes scattered over a relative container. Decorative and
// purely ambient — hidden from a11y, and frozen under reduced-motion (handled
// by the .animate-twinkle rule in globals.css).
//
// By default it draws the shared `SCATTER` pattern; pass `count` to take fewer
// motes and `tone` to force a single candlelight colour. `sparks` still allows
// a fully custom set when needed.
export function Sparkles({
  sparks,
  count,
  tone,
  className,
}: {
  sparks?: Spark[];
  count?: number;
  tone?: SparkTone;
  className?: string;
}) {
  const items = (sparks ?? SCATTER)
    .slice(0, count)
    .map((s) => (tone ? { ...s, tone } : s));

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {items.map((s, i) => (
        <Sparkle
          key={i}
          fill="currentColor"
          strokeWidth={0}
          className={cn(
            TONE_CLASS[s.tone ?? "sky"],
            "absolute animate-twinkle drop-shadow-2xl will-change-transform",
            "drop-shadow-[0_0_6px_currentColor]",
            TONE_CLASS[s.tone ?? "sky"],
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
