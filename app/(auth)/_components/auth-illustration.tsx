"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * "La lumière au seuil" — Configuration globale et design tokens.
 */
const CONFIG = {
  STAR_MIN_RADIUS: 0.18,
  STAR_RADIUS_MULTIPLIER: 0.75,
  STAR_BRIGHT_THRESHOLD: 0.85,
  TOTAL_STAR_LIMIT: 95,
  MIN_STAR_DISTANCE: 4.8,
  CLUSTER_COUNT: 2,
  colors: {
    // Ciel nocturne en teintes bleu ciel / bleu profond (cohérent avec le thème)
    skyTop: "oklch(0.15 0.12 252)",
    skyMid1: "oklch(0.22 0.14 250)",
    skyMid2: "oklch(0.28 0.15 248)",
    skyBottom: "oklch(0.25 0.12 246)",
    horizonGlow: "oklch(0.35 0.18 244)",
    starBright: "oklch(0.98 0.02 250)",
    starDim: "oklch(0.85 0.02 250)",
    starHalo: "oklch(0.78 0.08 248)",
  },
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;

// Zone occupée par la tente
const inTent = (x: number, y: number) => x > 15 && x < 85 && y > 45 && y < 120;

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  bright: boolean;
  dur: number;
  delay: number;
};

const STARS: Star[] = (() => {
  const rnd = mulberry32(20260619);
  const gauss = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = rnd();
    while (v === 0) v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: Star[] = [];
  const reserved = (x: number, y: number) => x < 30 && y < 13;

  const place = (x: number, y: number) => {
    if (x < 1 || x > 99 || y < 2 || y > 102 || inTent(x, y) || reserved(x, y)) {
      return false;
    }

    for (const star of out) {
      const dx = star.x - x;
      const dy = star.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < CONFIG.MIN_STAR_DISTANCE) {
        return false;
      }
    }

    const r =
      CONFIG.STAR_MIN_RADIUS +
      Math.pow(rnd(), 2.4) * CONFIG.STAR_RADIUS_MULTIPLIER;
    const bright = r > CONFIG.STAR_BRIGHT_THRESHOLD;
    const op = Math.min(
      1,
      0.2 +
        ((r - CONFIG.STAR_MIN_RADIUS) / CONFIG.STAR_RADIUS_MULTIPLIER) * 0.72 +
        rnd() * 0.16,
    );

    out.push({
      x: r1(x),
      y: r1(y),
      r: r2(r),
      base: r2(op),
      bright,
      dur: r2(2.6 + rnd() * 3.6),
      delay: r2(rnd() * 4),
    });
    return true;
  };

  for (let c = 0; c < CONFIG.CLUSTER_COUNT; c++) {
    const cx = 8 + rnd() * 84;
    const cy = 4 + rnd() * 88;
    const sigma = 3.5 + rnd() * 6;
    const n = 3 + Math.floor(rnd() * 4);
    let placed = 0;
    let guard = 0;
    while (placed < n && guard < 100) {
      guard++;
      if (place(cx + gauss() * sigma, cy + gauss() * sigma)) placed++;
    }
  }

  let guard = 0;
  while (out.length < CONFIG.TOTAL_STAR_LIMIT && guard < 3000) {
    guard++;
    place(rnd() * 100, 2 + rnd() * 100);
  }

  return out;
})();

const sparkle = (L: number) => {
  const c = (L * 0.06).toFixed(2);
  const l = L.toFixed(2);
  return `M0 -${l} C${c} -${c} ${c} -${c} ${l} 0 C${c} ${c} ${c} ${c} 0 ${l} C-${c} ${c} -${c} ${c} -${l} 0 C-${c} -${c} -${c} -${c} 0 -${l} Z`;
};

export function AuthIllustration() {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className="ohel-avraham-illu absolute inset-0 h-full w-full bg-[#0a0a0f]"
      aria-hidden
    >
      <style>{`
        @media (dynamic-range: high) {
          .ohel-avraham-illu { dynamic-range-limit: no-limit; }
          .hdr-light-spill { fill: color(rec2100-pq 0.8 0.5 0.1); }
          .star-bright { fill: color(rec2100-pq 0.8 0.8 0.9); }
        }
      `}</style>

      <defs>
        {/* Filtre pour l'effet de bloom (lumière réaliste) */}
        <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dégradé du ciel */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CONFIG.colors.skyTop} />
          <stop offset="50%" stopColor={CONFIG.colors.skyMid1} />
          <stop offset="100%" stopColor={CONFIG.colors.skyBottom} />
        </linearGradient>

        <radialGradient id="horizonGlow" cx="50%" cy="73%" r="55%">
          <stop
            offset="0%"
            stopColor={CONFIG.colors.horizonGlow}
            stopOpacity="0.5"
          />
          <stop
            offset="100%"
            stopColor={CONFIG.colors.horizonGlow}
            stopOpacity="0"
          />
        </radialGradient>

        {/* Dégradé du sol avec occlusion de la tente */}
        <radialGradient id="groundShadow" cx="50%" cy="110%" r="60%">
          <stop offset="0%" stopColor="oklch(0.05 0.01 246)" />
          <stop offset="100%" stopColor="oklch(0.12 0.03 246)" />
        </radialGradient>

        {/* Lumière volumétrique sortant de la tente */}
        <linearGradient
          id="volumetricSpill"
          x1="50%"
          y1="90%"
          x2="50%"
          y2="150%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="oklch(0.95 0.15 75)" stopOpacity="0.8" />
          <stop offset="40%" stopColor="oklch(0.7 0.18 60)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.4 0.1 50)" stopOpacity="0" />
        </linearGradient>

        {/* Dégradés du tissu de la tente pour simuler le volume */}
        <linearGradient id="fabricDark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.15 0.02 250)" />
          <stop offset="100%" stopColor="oklch(0.22 0.04 248)" />
        </linearGradient>

        <linearGradient id="fabricLitLeft" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.15 65)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="oklch(0.25 0.05 248)" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="fabricLitRight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.15 65)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="oklch(0.25 0.05 248)" stopOpacity="1" />
        </linearGradient>

        <radialGradient id="interiorGlow" cx="50%" cy="85%" r="70%">
          <stop offset="0%" stopColor="oklch(0.98 0.18 80)" />
          <stop offset="40%" stopColor="oklch(0.85 0.2 65)" />
          <stop offset="100%" stopColor="oklch(0.3 0.1 40)" />
        </radialGradient>
      </defs>

      {/* Fond du Ciel */}
      <rect width="100" height="150" fill="url(#sky)" />
      <rect width="100" height="150" fill="url(#horizonGlow)" />

      {/* Étoiles */}
      {STARS.map((s, i) =>
        s.bright ? (
          <g key={i} transform={`translate(${s.x} ${s.y})`}>
            <circle
              r={s.r * 2.8}
              fill={CONFIG.colors.starHalo}
              opacity={0.12}
              filter="url(#bloom)"
            />
            <motion.path
              d={sparkle(s.r * 3)}
              fill={CONFIG.colors.starBright}
              className="star-bright"
              initial={{
                opacity: reduce ? 0.4 : 0.25,
                scale: reduce ? 1 : 0.85,
              }}
              animate={
                reduce
                  ? undefined
                  : { opacity: [0.25, 0.9, 0.25], scale: [0.85, 1.15, 0.85] }
              }
              transition={
                reduce
                  ? undefined
                  : {
                      duration: s.dur,
                      delay: s.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              style={{ transformOrigin: "center" }}
            />
            <circle
              r={s.r}
              fill={CONFIG.colors.starBright}
              className="star-bright"
            />
          </g>
        ) : (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={CONFIG.colors.starDim}
            initial={{ opacity: reduce ? s.base : s.base * 0.4 }}
            animate={
              reduce
                ? undefined
                : { opacity: [s.base * 0.4, s.base * 1.2, s.base * 0.4] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: s.dur * 1.2,
                    delay: s.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        ),
      )}

      {/* Sol et Ombre d'environnement */}
      <path
        d="M0 100 Q50 95 100 100 L100 150 L0 150 Z"
        fill="url(#groundShadow)"
      />

      {/* ======= TENTE RÉALISTE ======= */}
      <g id="tent-group">
        {/* Cordes arrières */}
        <path
          d="M50 48 L10 105 M50 48 L90 105"
          stroke="oklch(0.2 0.02 250)"
          strokeWidth="0.3"
          opacity="0.6"
        />

        {/* Intérieur de la tente (Fond éclairé) */}
        <path
          d="M38 105 L45 55 Q50 50 55 55 L62 105 Z"
          fill="url(#interiorGlow)"
        />

        {/* Drappé Arrière / Toile de fond assombrie */}
        <path
          d="M25 102 Q40 60 50 52 Q60 60 75 102 Q62 98 50 98 Q38 98 25 102 Z"
          fill="url(#fabricDark)"
          opacity="0.8"
        />

        {/* Pilier central / Mât (Silhouette) */}
        <rect
          x="49.2"
          y="52"
          width="1.6"
          height="55"
          fill="oklch(0.15 0.05 40)"
          opacity="0.9"
        />

        {/* Drappé Gauche (Tissu avec plis et lumière) */}
        <path
          d="M18 108 C 25 80, 38 60, 48 50 C 45 65, 41 85, 36 106 C 30 107, 24 108, 18 108 Z"
          fill="url(#fabricLitLeft)"
        />
        {/* Ombre de pli gauche */}
        <path
          d="M24 107 C 32 80, 42 62, 48 50 C 44 65, 36 85, 30 107 C 28 107, 26 107, 24 107 Z"
          fill="oklch(0.1 0.02 250)"
          opacity="0.4"
        />

        {/* Drappé Droit (Tissu avec plis et lumière) */}
        <path
          d="M82 108 C 75 80, 62 60, 52 50 C 55 65, 59 85, 64 106 C 70 107, 76 108, 82 108 Z"
          fill="url(#fabricLitRight)"
        />
        {/* Ombre de pli droit */}
        <path
          d="M76 107 C 68 80, 58 62, 52 50 C 56 65, 64 85, 70 107 C 72 107, 74 107, 76 107 Z"
          fill="oklch(0.1 0.02 250)"
          opacity="0.4"
        />

        {/* Toit / Auvent frontal */}
        <path
          d="M15 105 Q35 70 50 48 Q65 70 85 105 Q65 65 50 45 Q35 65 15 105 Z"
          fill="url(#fabricDark)"
        />
        <path
          d="M15 105 Q35 70 50 48 Q65 70 85 105 Q65 65 50 45 Q35 65 15 105 Z"
          fill="url(#interiorGlow)"
          opacity="0.15"
        />

        {/* Cordes avant */}
        <path
          d="M18 108 L2 120 M82 108 L98 120"
          stroke="oklch(0.3 0.05 250)"
          strokeWidth="0.4"
        />
        {/* Piquets */}
        <rect
          x="1"
          y="118"
          width="1"
          height="4"
          fill="oklch(0.2 0.02 250)"
          transform="rotate(-30 1 118)"
        />
        <rect
          x="98"
          y="118"
          width="1"
          height="4"
          fill="oklch(0.2 0.02 250)"
          transform="rotate(30 98 118)"
        />
      </g>

      {/* ======= LUMIÈRE VOLUMÉTRIQUE (SPILL) ======= */}
      {/* Le faisceau de lumière qui s'échappe de la tente vers le sol */}
      <motion.path
        d="M36 106 L64 106 L95 150 L5 150 Z"
        fill="url(#volumetricSpill)"
        className="hdr-light-spill"
        style={{ mixBlendMode: "screen" }}
        initial={{ opacity: 0.8 }}
        animate={reduce ? undefined : { opacity: [0.75, 0.9, 0.75] }}
        transition={
          reduce
            ? undefined
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
      />
      {/* Cœur de la lumière au sol (plus intense) */}
      <ellipse
        cx="50"
        cy="108"
        rx="16"
        ry="3"
        fill="oklch(0.98 0.15 75)"
        opacity="0.6"
        filter="url(#bloom)"
      />

      {/* ======= TABLE VIDE ======= */}
      <g transform="translate(42 92)">
        {/* Table Silhouette */}
        <path d="M1 8 L15 8 L13 10 L3 10 Z" fill="oklch(0.1 0.05 40)" />
        <path
          d="M3 10 L3 16 M13 10 L13 16"
          stroke="oklch(0.1 0.05 40)"
          strokeWidth="0.6"
        />
      </g>
    </svg>
  );
}
