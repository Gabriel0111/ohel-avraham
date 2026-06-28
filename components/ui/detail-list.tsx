import { cn } from "@/lib/utils";

// A calm, unified field list used for revealed profile / contact details
// (admin people dialogs, accepted-request reveals). Tone lives on the icon
// only; labels are sentence-case, values sit below in ink.

export type FieldTone = "sky" | "blue" | "rose" | "indigo" | "amber";

const FIELD_TONE: Record<FieldTone, string> = {
  sky: "text-primary",
  blue: "text-blue-500",
  rose: "text-rose-500",
  indigo: "text-indigo-500",
  amber: "text-amber-600",
};

export function DetailList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-muted/20 divide-y divide-border/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DetailRow({
  icon: Icon,
  tone,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: FieldTone;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-3.5 py-3">
      <Icon className={cn("size-4 shrink-0 mt-0.5", FIELD_TONE[tone])} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <div className="text-sm font-medium text-foreground break-words">
          {children}
        </div>
      </div>
    </div>
  );
}
