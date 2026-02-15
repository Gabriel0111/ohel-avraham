"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useCountUp } from "@/hooks/use-count-up";

const stats = [
  { value: 1200, suffix: "+", label: "Shabbat meals shared" },
  { value: 350, suffix: "+", label: "Active hosts" },
  { value: 50, suffix: "+", label: "Communities reached" },
  { value: 98, suffix: "%", label: "Guest satisfaction" },
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

  return (
    <section ref={ref} className="py-20 md:py-28 border-y border-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
        {stats.map((stat, i) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            isVisible={isVisible}
            delay={i * 150}
          />
        ))}
      </div>
    </section>
  );
}
