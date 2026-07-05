"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { format } from "date-fns";
import { enUS, fr, he } from "date-fns/locale";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Home,
  MapPin,
  User,
} from "lucide-react";
import { SearchBarTrigger } from "@/components/search/search-trigger";
import { EnumPill } from "@/components/ui/enum-pill";
import {
  EthnicityBadge,
  KashroutBadge,
  SectorBadge,
} from "@/components/ui/enum-badges";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Sparkles } from "./sparkles";
import { useSyncExternalStore } from "react";
import type { ReactNode, CSSProperties } from "react";

const emptySubscribe = () => () => {};

// The illustration shows THE single latest accepted invitation between a host
// and a guest, live from the backend. When a newer acceptance lands, the whole
// composition replays its spring entrance with a burst of sparkles — one
// deliberate "a new match just formed" moment; it never cycles on its own.
// Badges use the same enum values and localized system badges as the app.
type Person = {
  initials: string;
  name: string;
  /** City for the host, region for the guest. */
  sub: string;
  /** Kashrout enum value — hosts only (see app/enums/kashrout.ts). */
  kashrout?: string;
  /** Sector enum value — guests only (see app/enums/sector.ts). */
  sector?: string;
  /** Ethnicity enum value (see app/enums/ethnicity.ts). */
  ethnicity?: string;
};

type Match = { host: Person; guest: Person };

// Demo composition shown until a first real match exists in the database.
const FALLBACK_MATCH: Match = {
  host: {
    initials: "ML",
    name: "Moshé L.",
    sub: "Jérusalem",
    kashrout: "Mehadrin",
    ethnicity: "Ashkenazi",
  },
  guest: {
    initials: "SC",
    name: "Sarah C.",
    sub: "Jérusalem",
    sector: "Dati",
    ethnicity: "Sefardi",
  },
};

// A radial burst of candlelight sparks (host blue / guest amber) thrown out
// from the centre when a new match forms. Deterministic positions keep SSR and
// client in sync. Replays on each match because its wrapper remounts by key.
const BURST_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 140 + (i % 4) * 22;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: i % 3 === 0 ? 6 : 4,
    amber: i % 2 === 0,
    delay: (i % 5) * 0.03,
  };
});

function MatchBurst() {
  return (
    <div
      className="absolute left-1/2 top-1/2 z-10 pointer-events-none"
      aria-hidden
    >
      {BURST_PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className={cn(
            "absolute rounded-full",
            p.amber ? "bg-amber-400" : "bg-primary",
          )}
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1, 0.3] }}
          transition={{ duration: 1.1, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

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

// Shared source for the illustration and the plaque: the single latest
// accepted match, live. The subscription pushes a new value the moment a newer
// acceptance lands — that key change is the ONLY thing that replays the
// entrance transition (no autonomous carousel). Convex dedupes the underlying
// subscription across callers.
function useLatestMatch() {
  const { t, lang } = useT();
  const ill = t.hero.illustration;
  const latest = useQuery(api.requests.getLatestAcceptedMatch);
  // `mounted` gates client-only bits (the local-timezone timestamp) so SSR
  // never mismatches: false on the server snapshot, true after hydration.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const match: Match = latest
    ? {
        host: {
          initials: latest.host.initials,
          name: latest.host.name ?? ill.hostLabel,
          sub: latest.host.city ?? "",
          kashrout: latest.host.kashrout,
          ethnicity: latest.host.ethnicity,
        },
        guest: {
          initials: latest.guest.initials,
          name: latest.guest.name ?? ill.guestLabel,
          sub: latest.guest.region ?? "",
          sector: latest.guest.sector,
          ethnicity: latest.guest.ethnicity,
        },
      }
    : FALLBACK_MATCH;
  // Keying by match id makes the composition remount (with transition) only
  // when the latest match actually changes.
  const matchKey = latest?.matchId ?? "fallback";

  const dateLocale = lang === "fr" ? fr : lang === "he" ? he : enUS;
  const matchedLabel =
    mounted && latest
      ? format(new Date(latest.matchedAt), "d MMM · HH:mm", {
          locale: dateLocale,
        })
      : null;

  return { match, matchKey, matchedLabel };
}

// The "latest match" plaque: live-pulse dot + label + timestamp in one quiet
// pill. Sits UNDER the illustration on desktop and under the CTAs on mobile
// (where the illustration is hidden). The timestamp crossfades when a newer
// match lands; the pulse pauses under prefers-reduced-motion.
function LatestMatchPlaque({ className }: { className?: string }) {
  const { t } = useT();
  const { matchKey, matchedLabel } = useLatestMatch();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/85 ps-3.5 pe-4 py-2 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <span className="relative flex size-2 shrink-0" aria-hidden>
        <span className="absolute inline-flex size-full rounded-full bg-primary/50 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">
        {t.hero.illustration.latestMatch}
      </span>
      {matchedLabel && (
        <>
          <span className="h-3.5 w-px bg-border" aria-hidden />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={matchKey}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground tabular-nums whitespace-nowrap"
            >
              <Clock className="size-3 shrink-0" />
              {matchedLabel}
            </motion.span>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function HeroIllustration() {
  const { t } = useT();
  const ill = t.hero.illustration;
  const reduce = useReducedMotion() ?? false;
  const { match, matchKey } = useLatestMatch();

  // Triangle vertices, ordered host → invitation → guest so the connection
  // spark travels along the match as it forms.
  const vertices: CSSProperties[] = [
    { top: "calc(50% - 160px)", left: "50%" },
    { top: "calc(50% + 80px)", left: "calc(50% + 139px)" },
    { top: "calc(50% + 80px)", left: "calc(50% - 139px)" },
  ];

  return (
    <div className="relative w-full h-[560px]">
      {/* Lueur centrale + pulse à chaque nouvelle invitation acceptée */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-primary/12 blur-3xl pointer-events-none" />
      {!reduce && (
        <motion.div
          key={`glow-${matchKey}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 rounded-full bg-primary/25 blur-2xl pointer-events-none"
          initial={{ scale: 0.7, opacity: 0.55 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      )}

      {/* Étoiles — lueurs de bougie autour de l'anneau (hôte sky / invité ambre) */}
      <Sparkles />

      {/* « Dernière invitation acceptée » + date/heure — plaque calme SOUS la
          composition */}
      <LatestMatchPlaque className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2" />

      {/* Anneau extérieur statique (profondeur) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[440px] rounded-full border border-primary/6" />

      {/* Anneau principal — rotation lente */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full border-2 border-dashed border-primary/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      />

      {/* Points de connexion — l'étincelle se propage hôte → invitation → invité */}
      {vertices.map((pos, i) => (
        <div
          key={i}
          className="absolute z-0"
          style={{ ...pos, transform: "translate(-50%, -50%)" }}
        >
          <div className="size-3 rounded-full bg-primary ring-4 ring-primary/15" />
          {!reduce && (
            <motion.div
              key={`pulse-${matchKey}`}
              className="absolute inset-0 rounded-full ring-2 ring-primary/50"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1, delay: i * 0.14, ease: "easeOut" }}
            />
          )}
        </div>
      ))}

      {/* Composition de la dernière rencontre. Elle se remonte par `index`, donc
          chaque nouveau match rejoue l'entrée spring (+ burst) ; l'ancienne
          s'efface en parallèle (les cartes sont en absolute, pas de saut). */}
      <AnimatePresence>
        <motion.div
          key={matchKey}
          className="absolute inset-0"
          initial={false}
          exit={
            reduce
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 0.92,
                  transition: { duration: 0.3, ease: "easeIn" },
                }
          }
        >
          {!reduce && <MatchBurst />}

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
            entranceDelay={0.2}
          >
            <div className="w-52 bg-card border border-border/70 rounded-xl p-3.5 shadow-xl shadow-black/8">
              <div className="flex items-center gap-1.5 mb-3">
                <EnumPill color="sky" icon={Home}>
                  {ill.hostLabel}
                </EnumPill>
              </div>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shrink-0 shadow-sm shadow-primary/30">
                  <span className="text-primary-foreground font-bold text-xs">
                    {match.host.initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">
                    {match.host.name}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1">
                    <MapPin className="size-2.5 text-muted-foreground shrink-0" />
                    <span className="text-[9px] text-muted-foreground">
                      {match.host.sub}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {match.host.kashrout && (
                  <KashroutBadge value={match.host.kashrout} />
                )}
                {match.host.ethnicity && (
                  <EthnicityBadge value={match.host.ethnicity} />
                )}
                <span className="inline-flex items-center whitespace-nowrap rounded-full border border-transparent bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {ill.seats}
                </span>
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
            entranceDelay={0.42}
          >
            <div className="w-44 bg-primary rounded-xl p-3.5 shadow-xl shadow-primary/25">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="size-7 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-3.5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary-foreground">
                    {ill.invitation}
                  </p>
                  <p className="text-[9px] text-primary-foreground/70">
                    {ill.accepted}
                  </p>
                </div>
              </div>

              <div className="bg-primary-foreground/12 rounded-lg p-2.5">
                <p className="text-[11px] font-semibold text-primary-foreground">
                  {ill.fridayTime}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="size-2 text-primary-foreground/70 shrink-0" />
                  <p className="text-[9px] text-primary-foreground/80">
                    {match.host.sub}
                  </p>
                </div>
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
            entranceDelay={0.6}
          >
            <div className="w-44 bg-card border border-border/70 rounded-xl p-3.5 shadow-xl shadow-black/8">
              <div className="flex items-center gap-1.5 mb-2.5">
                <EnumPill color="amber" icon={User}>
                  {ill.guestLabel}
                </EnumPill>
              </div>

              <div className="flex items-center gap-2 mb-2.5">
                <div className="size-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
                  <span className="text-white text-[10px] font-bold">
                    {match.guest.initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">
                    {match.guest.name}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    {match.guest.sub}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2.5">
                {match.guest.sector && <SectorBadge value={match.guest.sector} />}
                {match.guest.ethnicity && (
                  <EthnicityBadge value={match.guest.ethnicity} />
                )}
              </div>

              <div className="flex items-center gap-1 pt-2 border-t border-border/60">
                <Flame className="size-2.5 text-amber-500 shrink-0" />
                <span className="text-[9px] text-muted-foreground">
                  {ill.lookingForShabbat}
                </span>
              </div>
            </div>
          </FloatingCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection() {
  const { t } = useT();

  return (
    // First fold: the hero owns the full viewport below the fixed navbar
    // (4rem), its content centred within it. `svh` keeps mobile toolbars from
    // causing overflow; on short viewports the section simply grows.
    <section className="relative flex flex-col min-h-[calc(100svh-4rem)]">
      {/* Fond pleine largeur (breakout du container max-w-7xl) */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{ left: "calc(50% - 50vw)", width: "100vw" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-3/4 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full flex-1 flex-col justify-center px-4 py-8 md:py-10">
        {/* Barre de recherche — point d'entrée principal, tout en haut */}
        <motion.div
          className="mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SearchBarTrigger />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Gauche — texte */}
          <div className="flex flex-col gap-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
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
                    "group text-base px-8 h-12 gap-2 rounded-lg shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30",
                })}
              >
                {t.hero.getStarted}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "text-base px-8 h-12 rounded-lg",
                })}
              >
                {t.hero.learnMore}
              </Link>
            </motion.div>

            {/* Mobile: the illustration is hidden, so the live "latest match"
                plaque carries the social proof here instead. */}
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <LatestMatchPlaque />
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
      </div>
    </section>
  );
}
