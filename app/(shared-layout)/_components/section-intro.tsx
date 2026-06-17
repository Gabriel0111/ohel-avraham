"use client";

import { cn } from "@/lib/utils";

// Shared section heading for the landing. Deliberately no uppercase tracked
// eyebrow — a warm title plus a one-line lead carries the section instead.
export function SectionIntro({
  title,
  lead,
  isVisible,
  align = "center",
  className,
}: {
  title: string;
  lead?: string;
  isVisible: boolean;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-14",
        align === "center"
          ? "items-center text-center"
          : "items-start text-start",
        className,
      )}
    >
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "text-lg text-muted-foreground leading-relaxed text-pretty transition-all duration-700",
            align === "center" ? "max-w-xl" : "max-w-md",
          )}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
