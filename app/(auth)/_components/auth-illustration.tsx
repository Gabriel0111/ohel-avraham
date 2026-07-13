"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * "La lumière au seuil" — Configuration globale et design tokens.
 *
 * La scène : la tente d'Abraham ouverte sur la nuit du désert. À l'intérieur,
 * une table dressée, des bougies, des convives déjà installés. Au seuil, l'hôte
 * fait signe à deux voyageurs qui approchent. Au-dessus, une colonne de lumière
 * très discrète — la Présence que l'hospitalité « dépasse » (Chabbat 127a).
 */
const CONFIG = {
  STAR_MIN_RADIUS: 0.18,
  STAR_RADIUS_MULTIPLIER: 0.75,
  STAR_BRIGHT_THRESHOLD: 0.85,
  TOTAL_STAR_LIMIT: 105,
  MIN_STAR_DISTANCE: 4.6,
  CLUSTER_COUNT: 2,
  colors: {
    // Ciel nocturne : indigo profond -> prune -> ambre chaud à l'horizon
    skyTop: "oklch(0.11 0.038 282)",
    skyMid: "oklch(0.15 0.045 320)",
    skyWarm: "oklch(0.20 0.06 20)",
    skyBottom: "oklch(0.23 0.075 45)",
    horizonGlow: "oklch(0.52 0.16 55)",
    starBright: "oklch(0.98 0.02 82)",
    starDim: "oklch(0.86 0.015 72)",
    starHalo: "oklch(0.82 0.10 58)",
    silhouette: "oklch(0.12 0.045 38)",
    flame: "oklch(0.96 0.16 88)",
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

// Zone occupée par la tente (décalée à gauche) et par les voyageurs
const inTent = (x: number, y: number) =>
  (x > 11 && x < 82 && y > 43 && y < 120) || (x > 75 && y > 94);

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

    // Les étoiles hautes dans le ciel sont légèrement plus présentes
    const altitudeBonus = Math.max(0, (45 - y) / 45) * 0.12;
    const r =
      CONFIG.STAR_MIN_RADIUS +
      Math.pow(rnd(), 2.4) * CONFIG.STAR_RADIUS_MULTIPLIER +
      altitudeBonus;
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

// Braises qui montent doucement devant l'entrée
const EMBERS = [
  { x: 43.5, y: 104, drift: 1.4, dur: 7.5, delay: 0 },
  { x: 49, y: 105.5, drift: -1.1, dur: 9, delay: 3 },
  { x: 53.5, y: 104.5, drift: 0.9, dur: 8, delay: 5.5 },
];

export function AuthIllustration() {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className="ohel-avraham-illu absolute inset-0 h-full w-full bg-[#131019]"
      aria-hidden
    >
      <style>{`
        @media (dynamic-range: high) {
          .ohel-avraham-illu { dynamic-range-limit: no-limit; }
          .hdr-hearth { fill: color(rec2100-pq 0.8 0.55 0.15); }
          .star-bright { fill: color(rec2100-pq 0.8 0.8 0.9); }
        }
      `}</style>

      <defs>
        {/* Filtre pour l'effet de bloom (lumière réaliste) */}
        <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur1" />
          <feGaussianBlur stdDeviation="7" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Adoucit les bords du tissu */}
        <filter id="soften" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.18" />
        </filter>

        <filter id="wideBlur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>

        <filter id="columnBlur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>

        <filter id="spillBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>

        {/* Dégradé du ciel */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CONFIG.colors.skyTop} />
          <stop offset="42%" stopColor={CONFIG.colors.skyMid} />
          <stop offset="72%" stopColor={CONFIG.colors.skyWarm} />
          <stop offset="100%" stopColor={CONFIG.colors.skyBottom} />
        </linearGradient>

        <radialGradient id="horizonGlow" cx="50%" cy="70%" r="52%">
          <stop
            offset="0%"
            stopColor={CONFIG.colors.horizonGlow}
            stopOpacity="0.45"
          />
          <stop
            offset="100%"
            stopColor={CONFIG.colors.horizonGlow}
            stopOpacity="0"
          />
        </radialGradient>

        {/* Colonne de lumière descendante — la Présence, en retrait */}
        <linearGradient id="shekhinah" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.92 0.05 85)" stopOpacity="0.22" />
          <stop offset="70%" stopColor="oklch(0.88 0.08 78)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="oklch(0.88 0.08 78)" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="groundShadow" cx="50%" cy="110%" r="62%">
          <stop offset="0%" stopColor="oklch(0.07 0.015 40)" />
          <stop offset="100%" stopColor="oklch(0.13 0.045 42)" />
        </radialGradient>

        {/* Lumière volumétrique sortant de la tente */}
        <linearGradient
          id="volumetricSpill"
          x1="50%"
          y1="90%"
          x2="50%"
          y2="140%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="oklch(0.93 0.15 72)" stopOpacity="0.75" />
          <stop offset="45%" stopColor="oklch(0.66 0.16 60)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="oklch(0.4 0.1 50)" stopOpacity="0" />
        </linearGradient>

        {/* Tissu : éclairé depuis l'ouverture, en bas — sombre vers le sommet */}
        <linearGradient id="fabricLitLeft" x1="0.9" y1="1" x2="0.1" y2="0">
          <stop offset="0%" stopColor="oklch(0.58 0.14 58)" />
          <stop offset="32%" stopColor="oklch(0.33 0.10 46)" />
          <stop offset="100%" stopColor="oklch(0.15 0.045 36)" />
        </linearGradient>
        <linearGradient id="fabricLitRight" x1="0.1" y1="1" x2="0.9" y2="0">
          <stop offset="0%" stopColor="oklch(0.58 0.14 58)" />
          <stop offset="32%" stopColor="oklch(0.33 0.10 46)" />
          <stop offset="100%" stopColor="oklch(0.15 0.045 36)" />
        </linearGradient>

        <linearGradient id="roofCap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.19 0.06 40)" />
          <stop offset="100%" stopColor="oklch(0.3 0.09 46)" />
        </linearGradient>

        {/* Rabats retroussés, éclairés par l'intérieur */}
        <linearGradient id="flapLeft" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.82 0.15 72)" />
          <stop offset="100%" stopColor="oklch(0.45 0.12 52)" />
        </linearGradient>
        <linearGradient id="flapRight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.82 0.15 72)" />
          <stop offset="100%" stopColor="oklch(0.45 0.12 52)" />
        </linearGradient>

        <radialGradient id="interiorGlow" cx="50%" cy="82%" r="75%">
          <stop offset="0%" stopColor="oklch(0.97 0.15 85)" />
          <stop offset="42%" stopColor="oklch(0.86 0.18 66)" />
          <stop offset="100%" stopColor="oklch(0.42 0.12 46)" />
        </radialGradient>

        {/* Texture tissée du drapé */}
        <pattern
          id="weave"
          width="1.4"
          height="1.4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(24)"
        >
          <path
            d="M0 0.35 H1.4"
            stroke="oklch(0.9 0.05 70)"
            strokeWidth="0.09"
            opacity="0.5"
          />
          <path
            d="M0 1.05 H1.4"
            stroke="oklch(0.05 0.02 40)"
            strokeWidth="0.12"
            opacity="0.6"
          />
        </pattern>

        {/* Assombrit le bas pour la lisibilité de la citation */}
        <linearGradient id="bottomScrim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.09 0.02 42)" stopOpacity="0" />
          <stop offset="100%" stopColor="oklch(0.09 0.02 42)" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Fond du Ciel */}
      <rect width="100" height="150" fill="url(#sky)" />
      <rect width="100" height="150" fill="url(#horizonGlow)" />

      {/* Colonne de lumière divine, très subtile, au-dessus de la tente */}
      <motion.path
        d="M24.5 -6 L68.5 -6 L54.5 52 L38.5 52 Z"
        fill="url(#shekhinah)"
        filter="url(#columnBlur)"
        style={{ mixBlendMode: "screen" }}
        initial={{ opacity: reduce ? 0.85 : 0.7 }}
        animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={
          reduce
            ? undefined
            : { duration: 11, repeat: Infinity, ease: "easeInOut" }
        }
      />

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

      {/* Dunes lointaines */}
      <path
        d="M0 99 Q18 95.6 38 98.4 Q30 97.2 14 98.8 Q5 99.4 0 99.6 Z"
        fill="oklch(0.18 0.05 45)"
        opacity="0.8"
      />
      <path
        d="M62 98.2 Q80 95.2 100 98.6 L100 100 L62 100 Z"
        fill="oklch(0.19 0.06 48)"
        opacity="0.8"
      />

      {/* Sol */}
      <path
        d="M0 100 Q50 95 100 100 L100 150 L0 150 Z"
        fill="url(#groundShadow)"
      />

      {/* ======= TENTE (décalée à gauche pour la composition) ======= */}
      <g transform="translate(-3.5 0)">
        {/* Cordes arrière */}
        <path
          d="M50 47 L11 104 M50 47 L89 104"
          stroke="oklch(0.22 0.04 42)"
          strokeWidth="0.28"
          opacity="0.6"
        />

        {/* Intérieur lumineux (arche d'ouverture) */}
        <path
          d="M38.5 106 C40.3 91, 42.8 74, 45.4 65 Q50 59.5 54.6 65 C57.2 74, 59.7 91, 61.5 106 Z"
          fill="url(#interiorGlow)"
        />

        {/* Contenu intérieur : silhouettes chaudes à contre-jour */}
        <g>
          {/* Tapis tissé */}
          <path
            d="M41.5 102.6 Q50 101.5 58.5 102.6 L57.4 106.4 Q50 107.3 42.6 106.4 Z"
            fill="oklch(0.34 0.11 28)"
            opacity="0.95"
          />
          <path
            d="M42.2 103.6 Q50 102.7 57.8 103.6 M42.6 105 Q50 104.2 57.4 105"
            stroke="oklch(0.62 0.13 55)"
            strokeWidth="0.22"
            opacity="0.55"
          />

          {/* Lampe à huile suspendue */}
          <path d="M50 62 L50 65" stroke="oklch(0.2 0.05 40)" strokeWidth="0.3" />
          <path
            d="M48.9 65.2 L51.1 65.2 L50.7 67 Q50 67.6 49.3 67 Z"
            fill="oklch(0.16 0.05 38)"
          />
          <motion.ellipse
            cx="50"
            cy="64.5"
            rx="0.5"
            ry="0.85"
            fill={CONFIG.colors.flame}
            className="hdr-hearth"
            filter="url(#bloom)"
            initial={{ opacity: reduce ? 0.95 : 0.8 }}
            animate={
              reduce ? undefined : { opacity: [0.75, 1, 0.85, 1, 0.75] }
            }
            transition={
              reduce
                ? undefined
                : { duration: 2.3, repeat: Infinity, ease: "easeInOut" }
            }
          />

          {/* Table basse */}
          <path
            d="M45 99.8 L55 99.8 L54.2 101.2 L45.8 101.2 Z"
            fill="oklch(0.14 0.05 38)"
          />
          <path
            d="M46.4 101.2 L46.4 103.4 M53.6 101.2 L53.6 103.4"
            stroke="oklch(0.14 0.05 38)"
            strokeWidth="0.5"
          />
          {/* Bougies de Chabbat */}
          <path
            d="M48.2 97.6 L48.8 97.6 L48.8 99.8 L48.2 99.8 Z M51.2 97.6 L51.8 97.6 L51.8 99.8 L51.2 99.8 Z"
            fill="oklch(0.25 0.06 45)"
          />
          <motion.g
            initial={{ opacity: reduce ? 0.95 : 0.85 }}
            animate={reduce ? undefined : { opacity: [0.8, 1, 0.9, 0.8] }}
            transition={
              reduce
                ? undefined
                : { duration: 3.1, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <ellipse
              cx="48.5"
              cy="97"
              rx="0.32"
              ry="0.6"
              fill={CONFIG.colors.flame}
              className="hdr-hearth"
              filter="url(#bloom)"
            />
            <ellipse
              cx="51.5"
              cy="97"
              rx="0.32"
              ry="0.6"
              fill={CONFIG.colors.flame}
              className="hdr-hearth"
              filter="url(#bloom)"
            />
          </motion.g>
          {/* Carafe */}
          <path
            d="M53.2 98.2 Q53.9 98.5 53.8 99.2 L53.6 99.8 L52.9 99.8 Q52.6 98.9 53.2 98.2 Z"
            fill="oklch(0.16 0.05 38)"
          />

          {/* Convive assis (gauche) */}
          <circle cx="43.9" cy="92.8" r="1.5" fill="oklch(0.15 0.05 38)" />
          <path
            d="M41.6 102.6 Q41.3 96.3 43.6 94.9 Q45.6 94.4 46.2 97.3 L46.7 99.8 Q44 100.4 42.9 102.6 Z"
            fill="oklch(0.15 0.05 38)"
          />
          {/* Convive assis (droite, plus petit) */}
          <circle cx="56.4" cy="94.4" r="1.25" fill="oklch(0.15 0.05 38)" />
          <path
            d="M58.2 102.6 Q58.5 97.3 56.6 96.2 Q54.9 95.8 54.4 98.3 L54.1 99.9 Q56.5 100.5 57.3 102.6 Z"
            fill="oklch(0.15 0.05 38)"
          />
        </g>

        {/* Drapés (tissu adouci, texture tissée, plis) */}
        <g filter="url(#soften)">
          <path
            d="M16 106 C 20 94, 32 70, 49.4 45.8 C 46.4 60, 43 82, 41.2 106 C 32.6 107.1, 23.4 107.1, 16 106 Z"
            fill="url(#fabricLitLeft)"
          />
          <path
            d="M16 106 C 20 94, 32 70, 49.4 45.8 C 46.4 60, 43 82, 41.2 106 C 32.6 107.1, 23.4 107.1, 16 106 Z"
            fill="url(#weave)"
            opacity="0.16"
          />
          <path
            d="M23.5 106.6 C 28 92, 38 68, 48.6 47.2 C 44 62, 37 86, 31.5 106.9 C 28.8 107, 26 106.9, 23.5 106.6 Z"
            fill="oklch(0.09 0.025 38)"
            opacity="0.22"
          />
          <path
            d="M33 106.9 C 37.5 88, 43 64, 49 46.8 C 46.5 62, 43.5 84, 41.8 106 C 38.8 106.6, 35.8 106.9, 33 106.9 Z"
            fill="oklch(0.09 0.025 38)"
            opacity="0.13"
          />

          <path
            d="M84 106 C 80 94, 68 70, 50.6 45.8 C 53.6 60, 57 82, 58.8 106 C 67.4 107.1, 76.6 107.1, 84 106 Z"
            fill="url(#fabricLitRight)"
          />
          <path
            d="M84 106 C 80 94, 68 70, 50.6 45.8 C 53.6 60, 57 82, 58.8 106 C 67.4 107.1, 76.6 107.1, 84 106 Z"
            fill="url(#weave)"
            opacity="0.16"
          />
          <path
            d="M76.5 106.6 C 72 92, 62 68, 51.4 47.2 C 56 62, 63 86, 68.5 106.9 C 71.2 107, 74 106.9, 76.5 106.6 Z"
            fill="oklch(0.09 0.025 38)"
            opacity="0.22"
          />
          <path
            d="M67 106.9 C 62.5 88, 57 64, 51 46.8 C 53.5 62, 56.5 84, 58.2 106 C 61.2 106.6, 64.2 106.9, 67 106.9 Z"
            fill="oklch(0.09 0.025 38)"
            opacity="0.13"
          />
        </g>

        {/* Toit : comble l'interstice entre les drapés au sommet */}
        <path
          d="M49.4 45.8 Q50 45 50.6 45.8 C 52.5 50, 54 56.5, 54.9 64.5 Q50 60.5 45.1 64.5 C 46 56.5, 47.5 50, 49.4 45.8 Z"
          fill="url(#roofCap)"
          filter="url(#soften)"
        />

        {/* Rabats retroussés autour de l'ouverture */}
        <path
          d="M45.4 65 C 43.4 76, 42 90, 41.4 106 L 43.9 105.6 C 44.5 90, 45.6 76, 47.7 64 Q 46.2 63.2 45.4 65 Z"
          fill="url(#flapLeft)"
          opacity="0.9"
        />
        <path
          d="M54.6 65 C 56.6 76, 58 90, 58.6 106 L 56.1 105.6 C 55.5 90, 54.4 76, 52.3 64 Q 53.8 63.2 54.6 65 Z"
          fill="url(#flapRight)"
          opacity="0.9"
        />

        {/* Liseré de lune sur le profil de la tente */}
        <path
          d="M16.5 105 C 24 88, 36 64, 49.4 46.2 Q 50 45.4 50.6 46.2 C 64 64, 76 88, 83.5 105"
          stroke="oklch(0.75 0.08 70)"
          strokeWidth="0.35"
          opacity="0.28"
          filter="url(#soften)"
        />

        {/* L'hôte au seuil, geste d'invitation vers les arrivants */}
        <g fill={CONFIG.colors.silhouette}>
          <circle cx="60.5" cy="87.9" r="1.45" />
          <path d="M58.8 106 Q58.4 96.5 59.6 91.8 Q60.1 90.4 60.9 90.4 Q61.9 90.4 62.4 92.4 L66.9 91.9 Q67.5 92.2 67.2 93 L63.1 94.3 Q63.7 99.4 63.7 106 Q61.2 106.35 58.8 106 Z" />
        </g>

        {/* Corde avant + piquet (côté gauche seulement : la droite
            traverserait les voyageurs qui approchent) */}
        <path
          d="M17 106 L4 118"
          stroke="oklch(0.32 0.06 46)"
          strokeWidth="0.35"
        />
        <path
          d="M3.4 117 L4.6 117.4 L3.8 121 L2.8 120.7 Z"
          fill="oklch(0.22 0.04 42)"
        />

        {/* Braises portées par l'air chaud devant l'entrée */}
        {!reduce &&
          EMBERS.map((e, i) => (
            <motion.circle
              key={i}
              cx={e.x}
              cy={e.y}
              r="0.28"
              fill="oklch(0.85 0.16 70)"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.7, 0], y: -7, x: e.drift }}
              transition={{
                duration: e.dur,
                delay: e.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

        {/* Lumière volumétrique qui s'échappe vers le sol */}
        <motion.path
          d="M39.5 106 L60.5 106 L91 150 L11 150 Z"
          fill="url(#volumetricSpill)"
          filter="url(#spillBlur)"
          style={{ mixBlendMode: "screen" }}
          initial={{ opacity: 0.8 }}
          animate={reduce ? undefined : { opacity: [0.75, 0.88, 0.75] }}
          transition={
            reduce
              ? undefined
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* Cœur de la lumière au seuil */}
        <ellipse
          cx="50"
          cy="107"
          rx="13"
          ry="2.1"
          fill="oklch(0.97 0.14 78)"
          className="hdr-hearth"
          opacity="0.42"
          filter="url(#bloom)"
        />
      </g>

      {/* Lueur qui s'étire vers les arrivants */}
      <ellipse
        cx="76"
        cy="111"
        rx="16"
        ry="3.4"
        fill="oklch(0.7 0.14 62)"
        opacity="0.2"
        filter="url(#wideBlur)"
      />

      {/* Voyageurs qui approchent, à contre-jour */}
      <g>
        <g fill="oklch(0.1 0.03 40)">
          <circle cx="81.3" cy="99.9" r="1.35" />
          <path d="M79.9 110.6 Q79.5 103.4 81.1 101.9 Q82.7 101.2 83.4 103.5 L83.9 106.4 L83.4 110.6 L82.5 110.6 L82 107 L81.3 110.6 Z" />
          {/* Bâton de marche */}
          <path
            d="M79.4 103.9 L78.5 111"
            stroke="oklch(0.1 0.03 40)"
            strokeWidth="0.32"
          />
          {/* Enfant, main dans la main */}
          <circle cx="86.2" cy="104.1" r="1.05" />
          <path d="M85.3 110.8 Q85 106.4 86.1 105.5 Q87.2 105.1 87.6 106.9 L87.8 108.2 L87.4 110.8 L86.8 110.8 L86.5 108.6 L86 110.8 Z" />
          <path
            d="M83.7 104.7 Q84.7 105.1 85.3 106"
            stroke="oklch(0.1 0.03 40)"
            strokeWidth="0.38"
            fill="none"
          />
        </g>
        {/* Liseré de lumière côté tente */}
        <path
          d="M80.3 101.6 Q79.7 103.4 79.9 106.2 M85.4 105.4 Q85 106.8 85.2 108.6"
          stroke="oklch(0.78 0.13 66)"
          strokeWidth="0.22"
          opacity="0.55"
          fill="none"
        />
      </g>

      {/* Scrim bas pour la lisibilité de la citation */}
      <rect x="0" y="114" width="100" height="36" fill="url(#bottomScrim)" />
    </svg>
  );
}
