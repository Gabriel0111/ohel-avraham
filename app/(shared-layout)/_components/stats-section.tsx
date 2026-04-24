"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useCountUp } from "@/hooks/use-count-up";
import { useT } from "@/lib/i18n/context";

const statValues = [
  { value: 1200, suffix: "+" },
  { value: 350, suffix: "+" },
  { value: 50, suffix: "+" },
  { value: 98, suffix: "%" },
];

function StatItem({
  value,
  suffix,
  label,
  isVisible,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
  delay: number;
}) {
  const count = useCountUp(value, isVisible, 2000, delay);

  return (
    <div
      className="flex flex-col items-center gap-2 transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tabular-nums">
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-muted-foreground text-sm md:text-base font-medium">
        {label}
      </span>
    </div>
  );
}

export function StatsSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const { t } = useT();

  return (
    <section ref={ref} className="py-20 md:py-28 border-y border-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
        {statValues.map((stat, i) => (
          <StatItem
            key={i}
            value={stat.value}
            suffix={stat.suffix}
            label={t.stats.labels[i]}
            isVisible={isVisible}
            delay={i * 150}
          />
        ))}
      </div>
    </section>
  );
}
