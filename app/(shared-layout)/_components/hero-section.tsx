"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Home,
  MapPin,
  Star,
  User,
} from "lucide-react";
import { SearchBarTrigger } from "@/components/search/search-trigger";
import { useT } from "@/lib/i18n/context";
import type { ReactNode, CSSProperties } from "react";

// Géométrie : triangle équilatéral inscrit dans le cercle (rayon 160px)
// Sommet haut   (270°) : (cx,         cy − 160px)
// Bas-droite    (30°)  : (cx + 139px, cy + 80px)
// Bas-gauche   (150°)  : (cx − 139px, cy + 80px)

function FloatingCard({
  children,
  position,
  floatY,
  duration,
  floatDelay,
  entranceDelay,
}: {
  children: ReactNode;
  position: CSSProperties;
  floatY: number[];
  duration: number;
  floatDelay: number;
  entranceDelay: number;
}) {
  return (
    <div className="absolute z-10" style={position}>
      {/* Entrée spring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 16,
          delay: entranceDelay,
        }}
      >
        {/* Flottement sinusoïdal continu */}
        <motion.div
          animate={{ y: floatY }}
          transition={{
            duration,
            repeat: Infinity,
            ease: [0.37, 0, 0.63, 1],
            delay: floatDelay,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

function HeroIllustration() {
  const { t } = useT();
  const ill = t.hero.illustration;
  return (
    <div className="relative w-full h-[580px]">
      {/* Lueur centrale */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-primary/12 blur-3xl pointer-events-none" />

      {/* Anneau extérieur statique (profondeur) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[440px] rounded-full border border-primary/6" />

      {/* Anneau principal — rotation lente */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full border-2 border-dashed border-primary/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      />

      {/* Points de connexion sur le cercle — z-index sous les cartes */}
      {(
        [
          { top: "calc(50% - 160px)", left: "50%" },
          { top: "calc(50% + 80px)", left: "calc(50% + 139px)" },
          { top: "calc(50% + 80px)", left: "calc(50% - 139px)" },
        ] as CSSProperties[]
      ).map((pos, i) => (
        <div
          key={i}
          className="absolute size-3 rounded-full bg-primary ring-4 ring-primary/15 z-0"
          style={{ ...pos, transform: "translate(-50%, -50%)" }}
        />
      ))}

      {/* ── HÔTE — sommet haut ── */}
      <FloatingCard
        position={{
          top: "calc(50% - 160px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        floatY={[0, -13, 0]}
        duration={4.6}
        floatDelay={0}
        entranceDelay={0.25}
      >
        <div className="w-52 bg-card border border-border/70 rounded-xl p-3.5 shadow-xl shadow-black/8">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              <Home className="size-2.5 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{ill.hostLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shrink-0 shadow-sm shadow-primary/30">
              <span className="text-primary-foreground font-bold text-xs">ML</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">Moshé Lévi</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-2 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[9px] text-muted-foreground ml-1">4.9</span>
              </div>
              <div className="flex items-center gap-0.5 mt-0.5">
                <MapPin className="size-2 text-muted-foreground shrink-0" />
                <span className="text-[9px] text-muted-foreground">Rehavia, Jérusalem</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-semibold border border-primary/15">Glatt Kosher</span>
            <span className="text-[9px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-semibold border border-primary/15">Ashkénaze</span>
            <span className="text-[9px] bg-muted text-muted-foreground rounded-full px-2 py-0.5">{ill.seats}</span>
          </div>
        </div>
      </FloatingCard>

      {/* ── INVITATION — bas-droite ── */}
      <FloatingCard
        position={{
          top: "calc(50% + 80px)",
          left: "calc(50% + 139px)",
          transform: "translate(-50%, -50%)",
        }}
        floatY={[0, 12, 0]}
        duration={3.9}
        floatDelay={0.6}
        entranceDelay={0.5}
      >
        <div className="w-44 bg-primary rounded-xl p-3.5 shadow-xl shadow-primary/25">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="size-7 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-3.5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary-foreground">{ill.invitation}</p>
              <p className="text-[9px] text-primary-foreground/70">{ill.accepted}</p>
            </div>
          </div>

          <div className="bg-primary-foreground/12 rounded-lg p-2.5 mb-2.5">
            <p className="text-[11px] font-semibold text-primary-foreground">{ill.fridayTime}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="size-2 text-primary-foreground/70 shrink-0" />
              <p className="text-[9px] text-primary-foreground/80">Rehavia, Jérusalem</p>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-2 fill-primary-foreground/80 text-primary-foreground/80" />
            ))}
            <span className="text-[9px] text-primary-foreground/70 ml-1">4.9</span>
          </div>
        </div>
      </FloatingCard>

      {/* ── INVITÉ — bas-gauche ── */}
      <FloatingCard
        position={{
          top: "calc(50% + 80px)",
          left: "calc(50% - 139px)",
          transform: "translate(-50%, -50%)",
        }}
        floatY={[0, -9, 0]}
        duration={5.3}
        floatDelay={1.1}
        entranceDelay={0.7}
      >
        <div className="w-44 bg-card border border-border/70 rounded-xl p-3.5 shadow-xl shadow-black/8">
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200/60 dark:border-amber-700/30">
              <User className="size-2.5 text-amber-600 dark:text-amber-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">{ill.guestLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2.5">
            <div className="size-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
              <span className="text-white text-[10px] font-bold">SC</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">Sarah Cohen</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Paris → Jérusalem</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-2.5">
            <span className="text-[9px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full px-2 py-0.5 font-semibold border border-amber-200/50 dark:border-amber-700/30">Glatt</span>
            <span className="text-[9px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full px-2 py-0.5 font-semibold border border-amber-200/50 dark:border-amber-700/30">Séfarade</span>
          </div>

          <div className="flex items-center gap-1 pt-2 border-t border-border/60">
            <Flame className="size-2.5 text-amber-500 shrink-0" />
            <span className="text-[9px] text-muted-foreground">{ill.lookingForShabbat}</span>
          </div>
        </div>
      </FloatingCard>
    </div>
  );
}

export function HeroSection() {
  const { t } = useT();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* Fond pleine largeur (breakout du container max-w-7xl) */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{ left: "calc(50% - 50vw)", width: "100vw" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-3/4 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Gauche — texte */}
          <div className="flex flex-col gap-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] text-balance"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t.hero.titleLine1}{" "}
              <span className="text-primary">{t.hero.titleHighlight}</span>
              <br />
              {t.hero.titleLine2}
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/sign-up"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "text-base px-8 h-12 gap-2 shadow-lg shadow-primary/25",
                })}
              >
                {t.hero.getStarted}
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
                {t.hero.learnMore}
              </Link>
            </motion.div>
          </div>

          {/* Droite — illustration (desktop) */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>

        {/* Barre de recherche */}
        <motion.div
          className="mt-10 md:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <SearchBarTrigger />
        </motion.div>
      </div>
    </section>
  );
}
