"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const REDIRECT_MS = 4600;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const theme = {
  host: {
    medallion: "from-violet-500 to-violet-600",
    glow: "bg-violet-500/25",
    sparks: ["#a78bfa", "#f59e0b", "#c4b5fd"],
  },
  guest: {
    medallion: "from-emerald-500 to-emerald-600",
    glow: "bg-emerald-500/25",
    sparks: ["#34d399", "#f59e0b", "#6ee7b7"],
  },
} as const;

// A single warm burst radiating outward from the medallion — a touch of
// celebration, not cartoon confetti.
const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 2 ? 0.22 : 0);
  const distance = 62 + (i % 4) * 17;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: i % 3 === 0 ? 8 : i % 3 === 1 ? 5 : 6,
    delay: 0.16 + (i % 5) * 0.014,
  };
});

function Checkmark({ reduce }: { reduce: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-11" aria-hidden>
      <motion.path
        d="M5 12.8 9.2 17 19 7"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: reduce ? 0 : 0.32, ease: "easeOut" }}
      />
    </svg>
  );
}

export function RegistrationSuccess({ role }: { role: "host" | "guest" }) {
  const { t } = useT();
  const router = useRouter();
  const reduce = useReducedMotion();
  const c = theme[role];

  useEffect(() => {
    const id = setTimeout(() => router.push("/dashboard"), REDIRECT_MS);
    return () => clearTimeout(id);
  }, [router]);

  const title = role === "host" ? t.celebrate.hostTitle : t.celebrate.guestTitle;
  const desc = role === "host" ? t.celebrate.hostDesc : t.celebrate.guestDesc;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-7 py-8 text-center"
    >
      <div className="relative grid place-items-center">
        <motion.div
          aria-hidden
          className={cn("absolute size-32 rounded-full blur-2xl", c.glow)}
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        />

        {!reduce && (
          <div aria-hidden className="absolute inset-0 grid place-items-center">
            {SPARKS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: s.size,
                  height: s.size,
                  backgroundColor: c.sparks[i % c.sparks.length],
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: s.x,
                  y: s.y,
                  scale: [0, 1, 0.4],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.1, delay: s.delay, ease: EASE_OUT }}
              />
            ))}
          </div>
        )}

        <motion.div
          className={cn(
            "relative grid size-24 place-items-center rounded-full bg-gradient-to-br text-white shadow-lg ring-8 ring-background",
            c.medallion,
          )}
          initial={reduce ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 17,
            delay: reduce ? 0 : 0.08,
          }}
        >
          <Checkmark reduce={!!reduce} />
        </motion.div>
      </div>

      <motion.div
        className="space-y-2"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduce ? 0 : 0.36, ease: EASE_OUT }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-balance">
          {title}
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
          {desc}
        </p>
      </motion.div>

      <motion.div
        className="flex w-full flex-col items-center gap-3"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduce ? 0 : 0.5, ease: EASE_OUT }}
      >
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-amber-500" />
          {t.celebrate.pendingNote}
        </p>
        <Button
          size="lg"
          className="group w-full gap-2"
          onClick={() => router.push("/dashboard")}
        >
          {t.celebrate.continue}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
