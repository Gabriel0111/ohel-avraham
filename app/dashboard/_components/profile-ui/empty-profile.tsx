"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Tent } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

export const EmptyProfile = () => {
  const { t } = useT();
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border/70 bg-gradient-to-b from-muted/30 to-transparent px-6 py-12 text-center"
    >
      <div className="relative grid place-items-center">
        <div
          aria-hidden
          className="absolute size-20 rounded-full bg-primary/10 blur-xl"
        />
        <div className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/15">
          <Tent className="size-7" />
        </div>
      </div>

      <div className="max-w-sm space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-foreground text-balance">
          {t.emptyProfile.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {t.emptyProfile.desc}
        </p>
      </div>

      <Link
        href="/complete-registration"
        className={cn(buttonVariants({ size: "sm" }), "group gap-1.5")}
      >
        {t.emptyProfile.cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
};
