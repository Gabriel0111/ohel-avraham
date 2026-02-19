"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FloatingPaths } from "@/app/(auth)/_components/floating-paths";
import { SearchBarTrigger } from "@/components/search/search-trigger";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <FloatingPaths position={1} />
      </div>
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
            {"Bringing the spirit of Abraham's hospitality to life"}
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance max-w-4xl leading-[1.1]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          Share the warmth of{" "}
          <span className="text-primary">Shabbat</span>
          <br />
          with open doors
        </motion.h1>

        <motion.p
          className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Ohel Avraham connects hosts who open their homes for Shabbat meals
          with guests looking for a warm, meaningful experience. No one should
          eat alone.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        >
          <Link
            href="/sign-up"
            className={buttonVariants({
              size: "lg",
              className: "text-base px-8 h-12",
            })}
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/about"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "text-base px-8 h-12",
            })}
          >
            Learn More
          </Link>
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <SearchBarTrigger />
        </motion.div>
      </div>
    </section>
  );
}
