"use client";

import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Spark = {
  top: string;
  left: string;
  size: number;
  delay?: number;
  duration?: number;
  tone?: "primary" | "amber";
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
            "absolute animate-twinkle",
            s.tone === "amber" ? "text-amber-400" : "text-primary",
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
