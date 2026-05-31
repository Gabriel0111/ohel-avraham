import { cn } from "@/lib/utils";

export type PillColor =
  | "violet"
  | "blue"
  | "emerald"
  | "pink"
  | "slate"
  | "green"
  | "amber";

const PILL_COLORS: Record<PillColor, string> = {
  violet:
    "bg-violet-500/10 text-violet-700 border-violet-500/15 dark:text-violet-300",
  blue: "bg-blue-500/10 text-blue-700 border-blue-500/15 dark:text-blue-300",
  emerald:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/15 dark:text-emerald-300",
  pink: "bg-pink-500/10 text-pink-700 border-pink-500/15 dark:text-pink-300",
  slate:
    "bg-slate-500/10 text-slate-700 border-slate-500/15 dark:text-slate-300",
  green:
    "bg-green-500/10 text-green-700 border-green-500/15 dark:text-green-300",
  amber:
    "bg-amber-500/10 text-amber-700 border-amber-500/15 dark:text-amber-300",
};

export function EnumPill({
  color,
  icon: Icon,
  className,
  children,
}: {
  color: PillColor;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap",
        PILL_COLORS[color],
        className,
      )}
    >
      {Icon && <Icon className="size-3" />}
      {children}
    </span>
  );
}

export function genderColor(gender: string): PillColor {
  if (gender === "Female") return "pink";
  if (gender === "Couple") return "violet";
  return "blue";
}
