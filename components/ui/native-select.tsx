"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NativeSelectOption {
  value: string;
  label: string;
  /**
   * Optional emoji/text glyph shown before the label. Native menus can't render
   * SVG icons, so an icon is preserved as a leading glyph (e.g. a flag emoji).
   */
  glyph?: string;
}

interface NativeSelectProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: NativeSelectOption[];
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  /** Decorative leading icon rendered inside the trigger. */
  icon?: React.ReactNode;
  name?: string;
  onBlur?: () => void;
  id?: string;
}

/**
 * A real <select> styled to match the design system. Because it's a native
 * control, mobile browsers (iOS / iPadOS / Android) render it with the system
 * picker — the wheel/list users expect — while desktop gets the native
 * dropdown. Options can carry an emoji `glyph` since native menus can't render
 * SVG icons. Uses logical (start/end) spacing so it mirrors under RTL.
 */
export function NativeSelect({
  value,
  onValueChange,
  options,
  placeholder,
  invalid,
  disabled,
  className,
  icon,
  name,
  onBlur,
  id,
}: NativeSelectProps) {
  const isEmpty = value == null || value === "";

  return (
    <div className={cn("relative w-full", className)}>
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
      )}
      <select
        id={id}
        name={name}
        value={value ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        data-placeholder={isEmpty || undefined}
        className={cn(
          "flex h-9 w-full cursor-pointer appearance-none items-center rounded-md border border-input bg-background py-2 text-sm shadow-xs outline-none transition-[color,box-shadow]",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
          "data-placeholder:text-muted-foreground",
          icon ? "ps-9 pe-9" : "ps-3 pe-9",
        )}
      >
        {placeholder != null && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.glyph ? `${opt.glyph}  ${opt.label}` : opt.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
    </div>
  );
}
