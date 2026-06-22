"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
 * True on coarse-pointer devices (phones / tablets), where the OS picker —
 * the wheel/list users expect — is the better control. Desktop (fine pointer)
 * gets the styled Radix dropdown instead. Starts `false` so server and first
 * client render agree (native is the SSR-safe default); a desktop briefly shows
 * the native control for one frame before switching, which avoids a hydration
 * mismatch.
 */
function useCoarsePointer() {
  const [coarse, setCoarse] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return coarse;
}

/**
 * A select that adapts to the device: the OS-native `<select>` on touch
 * devices (iPhone / iPadOS / Android — the system picker) and the design
 * system's Radix dropdown on desktop. The public API is identical across both
 * so call sites (and their React Hook Form wiring) never change. Despite the
 * name, only touch devices actually render the native control.
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
  const coarse = useCoarsePointer();

  // Desktop (fine pointer): the styled Radix dropdown.
  if (coarse === false) {
    return (
      <Select
        value={value || undefined}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={id}
          onBlur={onBlur}
          aria-invalid={invalid || undefined}
          className={cn("w-full", className)}
        >
          {icon && (
            <span className="shrink-0 text-muted-foreground [&_svg]:size-4">
              {icon}
            </span>
          )}
          {/* Keep SelectValue a direct child so the trigger's line-clamp/
              truncation applies — a long placeholder must clip, not overflow. */}
          <SelectValue
            placeholder={placeholder}
            className="min-w-0 flex-1 truncate text-start"
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.glyph ? `${opt.glyph}  ${opt.label}` : opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Touch devices (and the SSR / pre-mount default): the real <select> so the
  // OS renders its system picker.
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
