"use client";

import flags from "react-phone-number-input/flags";
import { Check, ChevronsUpDown, Languages } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LANGUAGES } from "@/app/enums/language";
import { cn } from "@/lib/utils";

interface LanguageSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  /** Render the trigger in an invalid (error) state. */
  invalid?: boolean;
}

/**
 * Multi-select dropdown for spoken languages. The trigger shows the picked
 * flags + names; the popover lists every language with a toggleable check.
 */
export function LanguageSelect({
  value,
  onChange,
  placeholder = "Select languages",
  className,
  invalid,
}: LanguageSelectProps) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (code: string) => {
    onChange(
      selected.includes(code)
        ? selected.filter((c) => c !== code)
        : [...selected, code],
    );
  };

  const selectedLangs = LANGUAGES.filter((l) => selected.includes(l.value));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs outline-none transition-[color,box-shadow] hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            invalid && "border-destructive ring-[3px] ring-destructive/20",
            className,
          )}
        >
          {selectedLangs.length > 0 ? (
            <span className="flex flex-1 flex-wrap items-center gap-1.5">
              {selectedLangs.map((lang) => {
                const Flag = flags[lang.country];
                return (
                  <span
                    key={lang.value}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs"
                  >
                    <span className="w-4 shrink-0 overflow-hidden rounded-xs">
                      {Flag && <Flag title={lang.label} />}
                    </span>
                    {lang.label}
                  </span>
                );
              })}
            </span>
          ) : (
            <span className="flex flex-1 items-center gap-2 text-muted-foreground">
              <Languages className="size-4 shrink-0" />
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground/70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1"
        align="start"
      >
        <div className="max-h-64 overflow-y-auto">
          {LANGUAGES.map((lang) => {
            const Flag = flags[lang.country];
            const isSelected = selected.includes(lang.value);
            return (
              <button
                key={lang.value}
                type="button"
                onClick={() => toggle(lang.value)}
                aria-pressed={isSelected}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent",
                  isSelected && "font-medium",
                )}
              >
                <span className="w-5 shrink-0 overflow-hidden rounded-xs">
                  {Flag && <Flag title={lang.label} />}
                </span>
                <span className="flex-1 text-start">{lang.label}</span>
                <Check
                  className={cn(
                    "size-4 shrink-0 text-primary transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
