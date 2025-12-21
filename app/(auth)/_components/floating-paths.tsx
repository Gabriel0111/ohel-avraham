import { motion } from "motion/react";

export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    // Gradient from violet-500 to fuchsia-500
    hue: 270 - (i / 36) * 30, // 270 (violet) to 240 (purple/fuchsia)
    opacity: 0.15 + i * 0.025,
    width: 0.5 + i * 0.04,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full" fill="none" viewBox="0 0 696 316">
        <title>Background Paths</title>
        <defs>
          {paths.map((path) => (
            <linearGradient
              key={`gradient-${path.id}`}
              id={`gradient-${path.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={`hsl(${path.hue}, 91%, 60%)`}
                stopOpacity={path.opacity}
              />
              <stop
                offset="50%"
                stopColor={`hsl(${path.hue - 15}, 85%, 65%)`}
                stopOpacity={path.opacity * 1.2}
              />
              <stop
                offset="100%"
                stopColor={`hsl(${path.hue - 30}, 80%, 70%)`}
                stopOpacity={path.opacity * 0.8}
              />
            </linearGradient>
          ))}
        </defs>
        {paths.map((path) => (
          <motion.path
            animate={{
              pathLength: 1,
              opacity: [
                path.opacity * 0.6,
                path.opacity * 1.2,
                path.opacity * 0.6,
              ],
              pathOffset: [0, 1, 0],
            }}
            d={path.d}
            initial={{ pathLength: 0.3, opacity: path.opacity }}
            key={path.id}
            stroke={`url(#gradient-${path.id})`}
            strokeWidth={path.width}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
