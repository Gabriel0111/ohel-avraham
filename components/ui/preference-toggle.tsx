"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Hospitality preferences (e.g. "Likes singing", "Likes Divrei Torah") are
 * shown as compact, icon-only controls: a tooltip carries the title, and color
 * encodes the preference. `PreferenceToggle` is the interactive form control;
 * `PreferenceBadge` is its read-only counterpart for display surfaces, so the
 * editing and viewing states look like the same object.
 */
export type PreferenceColor = "sky" | "blue" | "rose";

const COLORS: Record<
  PreferenceColor,
  { on: string; off: string; badge: string }
> = {
  sky: {
    on: "bg-primary/15 text-primary ring-primary/30",
    off: "bg-muted/40 text-muted-foreground ring-border/60 hover:bg-primary/10 hover:text-primary hover:ring-primary/20",
    badge: "bg-primary/10 text-primary ring-primary/15",
  },
  rose: {
    on: "bg-rose-500/15 text-rose-600 ring-rose-500/30 dark:text-rose-300",
    off: "bg-muted/40 text-muted-foreground ring-border/60 hover:bg-rose-500/10 hover:text-rose-600 hover:ring-rose-500/20 dark:hover:text-rose-300",
    badge:
      "bg-rose-500/10 text-rose-600 ring-rose-500/15 dark:text-rose-300",
  },
  blue: {
    on: "bg-blue-500/15 text-blue-600 ring-blue-500/30 dark:text-blue-300",
    off: "bg-muted/40 text-muted-foreground ring-border/60 hover:bg-blue-500/10 hover:text-blue-600 hover:ring-blue-500/20 dark:hover:text-blue-300",
    badge: "bg-blue-500/10 text-blue-600 ring-blue-500/15 dark:text-blue-300",
  },
};

export function PreferenceToggle({
  icon: Icon,
  label,
  color = "sky",
  active,
  onChange,
  disabled,
  className,
}: {
  icon: LucideIcon;
  /** Tooltip text and accessible name. */
  label: string;
  color?: PreferenceColor;
  active: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  const c = COLORS[color];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          role="switch"
          aria-checked={active}
          aria-label={label}
          disabled={disabled}
          onClick={() => onChange(!active)}
          className={cn(
            "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl ring-1 outline-none transition-colors",
            "focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            active ? c.on : c.off,
            className,
          )}
        >
          <Icon className="size-4.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function PreferenceBadge({
  icon: Icon,
  label,
  color = "sky",
  className,
}: {
  icon: LucideIcon;
  label: string;
  color?: PreferenceColor;
  className?: string;
}) {
  const c = COLORS[color];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full ring-1",
            c.badge,
            className,
          )}
        >
          <Icon className="size-3.5" />
          <span className="sr-only">{label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
