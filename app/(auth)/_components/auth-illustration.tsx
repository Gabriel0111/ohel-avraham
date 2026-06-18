"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * "La lumière au seuil" — Configuration globale et design tokens.
 */
const CONFIG = {
  // Tailles des étoiles
  STAR_MIN_RADIUS: 0.18,
  STAR_RADIUS_MULTIPLIER: 0.75,
  STAR_BRIGHT_THRESHOLD: 0.85,

  // Répartition et densité
  TOTAL_STAR_LIMIT: 85, // Augmenté pour couvrir toute la surface
  MIN_STAR_DISTANCE: 5.5, // La clé du secret : force les étoiles à s'espacer élégamment
  CLUSTER_COUNT: 3, // Moins d'amas, plus de répartition globale

  // Couleurs OKLCH
  colors: {
    skyTop: "oklch(0.12 0.022 289)",
    skyMid1: "oklch(0.155 0.05 292)",
    skyMid2: "oklch(0.235 0.095 293)",
    skyBottom: "oklch(0.145 0.04 290)",
    horizonGlow: "oklch(0.541 0.281 293)",
    starBright: "oklch(0.97 0.02 285)",
    starDim: "oklch(0.92 0.02 288)",
    starHalo: "oklch(0.78 0.08 290)",
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

const inTent = (x: number, y: number) => x > 26 && x < 74 && y > 64 && y < 109;

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
    // Vérification des zones interdites
    if (x < 1 || x > 99 || y < 2 || y > 102 || inTent(x, y) || reserved(x, y)) {
      return false;
    }

    // Vérification de la distance minimale pour une répartition homogène
    for (const star of out) {
      const dx = star.x - x;
      const dy = star.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < CONFIG.MIN_STAR_DISTANCE) {
        return false; // Rejeté, trop proche d'une autre étoile
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

  // 1. Placement de quelques amas légers pour éviter un look "grille parfaite"
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

  // 2. Remplissage global sur toute la surface
  let guard = 0;
  // On utilise une limite de garde très haute (3000) car la règle de distance
  // va rejeter beaucoup de tentatives vers la fin du remplissage.
  while (out.length < CONFIG.TOTAL_STAR_LIMIT && guard < 3000) {
    guard++;
    place(rnd() * 100, 2 + rnd() * 100);
  }

  return out;
})();

const sparkle = (L: number) => {
  const c = (L * 0.07).toFixed(2);
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
      className="auth-illu absolute inset-0 h-full w-full"
      aria-hidden
    >
      <style>{`
        @media (dynamic-range: high) {
          .auth-illu { dynamic-range-limit: no-limit; }
          .door-core-a { stop-color: color(rec2100-pq 0.67 0.61 0.46); }
          .door-core-b { stop-color: color(rec2100-pq 0.61 0.50 0.31); }
          .door-pool  { fill: color(rec2100-pq 0.59 0.48 0.31); }
          .star-bright { fill: color(rec2100-pq 0.64 0.64 0.66); }
        }
      `}</style>

      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CONFIG.colors.skyTop} />
          <stop offset="42%" stopColor={CONFIG.colors.skyMid1} />
          <stop offset="72%" stopColor={CONFIG.colors.skyMid2} />
          <stop offset="100%" stopColor={CONFIG.colors.skyBottom} />
        </linearGradient>

        <radialGradient id="horizonGlow" cx="50%" cy="73%" r="55%">
          <stop
            offset="0%"
            stopColor={CONFIG.colors.horizonGlow}
            stopOpacity="0.42"
          />
          <stop
            offset="55%"
            stopColor="oklch(0.45 0.2 293)"
            stopOpacity="0.14"
          />
          <stop offset="100%" stopColor="oklch(0.45 0.2 293)" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="doorLight" cx="50%" cy="80%" r="68%">
          <stop
            className="door-core-a"
            offset="0%"
            stopColor="oklch(0.95 0.05 82)"
            stopOpacity="0.95"
          />
          <stop
            className="door-core-b"
            offset="45%"
            stopColor="oklch(0.86 0.11 70)"
            stopOpacity="0.7"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.75 0.13 55)"
            stopOpacity="0.05"
          />
        </radialGradient>

        <linearGradient id="spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.9 0.09 72)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.9 0.09 72)" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.165 0.05 291)" />
          <stop offset="100%" stopColor="oklch(0.1 0.02 288)" />
        </linearGradient>
      </defs>

      <rect width="100" height="150" fill="url(#sky)" />
      <rect width="100" height="150" fill="url(#horizonGlow)" />

      {/* Starfield */}
      {STARS.map((s, i) =>
        s.bright ? (
          <g key={i} transform={`translate(${s.x} ${s.y})`}>
            <circle
              r={s.r * 2.4}
              fill={CONFIG.colors.starHalo}
              opacity={0.09}
            />
            <motion.path
              d={sparkle(s.r * 3)}
              fill={CONFIG.colors.starBright}
              initial={{
                opacity: reduce ? 0.5 : 0.3,
                scale: reduce ? 1 : 0.82,
              }}
              animate={
                reduce
                  ? undefined
                  : { opacity: [0.3, 0.72, 0.3], scale: [0.82, 1.08, 0.82] }
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
              className="star-bright"
              r={s.r}
              fill={CONFIG.colors.starBright}
            />
          </g>
        ) : (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={CONFIG.colors.starDim}
            initial={{ opacity: reduce ? s.base : s.base * 0.5 }}
            animate={
              reduce
                ? undefined
                : { opacity: [s.base * 0.5, s.base, s.base * 0.5] }
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
          />
        ),
      )}

      {/* Ground */}
      <path d="M0 108 Q50 104 100 107 L100 150 L0 150 Z" fill="url(#ground)" />
      <path
        d="M0 108 Q50 104 100 107"
        stroke="oklch(0.6 0.2 293)"
        strokeOpacity="0.25"
        strokeWidth="0.4"
        fill="none"
      />

      {/* Tent */}
      <g>
        <path
          d="M28 108 C31 86 43 76 50 73 C57 76 69 86 72 108 Z"
          fill="oklch(0.2 0.07 292)"
          stroke="oklch(0.62 0.2 293)"
          strokeOpacity="0.55"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <line
          x1="50"
          y1="73"
          x2="50"
          y2="70"
          stroke="oklch(0.62 0.2 293)"
          strokeOpacity="0.5"
          strokeWidth="0.45"
        />
        <circle
          cx="50"
          cy="69.6"
          r="0.7"
          fill="oklch(0.72 0.2 293)"
          opacity="0.7"
        />

        <motion.path
          d="M43.5 108 L43.5 91 Q43.5 83 50 83 Q56.5 83 56.5 91 L56.5 108 Z"
          fill="url(#doorLight)"
          initial={{ opacity: 0.92 }}
          animate={reduce ? undefined : { opacity: [0.82, 1, 0.82] }}
          transition={
            reduce
              ? undefined
              : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        />
      </g>

      <path d="M43.5 107 L56.5 107 L70 132 L30 132 Z" fill="url(#spill)" />
      <ellipse
        className="door-pool"
        cx="50"
        cy="108.5"
        rx="13"
        ry="2.6"
        fill="oklch(0.9 0.09 72)"
        opacity="0.28"
      />
    </svg>
  );
}
