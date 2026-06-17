"use client";

import { useState } from "react";
import { SearchDialog } from "./search-dialog";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

interface SearchTriggerButtonProps {
  className?: string;
}

export function SearchTriggerButton({ className }: SearchTriggerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className={cn("size-9", className)}
        aria-label="Search hosts"
      >
        <Search className="size-4" />
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

interface SearchBarTriggerProps {
  className?: string;
}

export function SearchBarTrigger({ className }: SearchBarTriggerProps) {
  const [open, setOpen] = useState(false);
  const { t } = useT();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.search.searchBarPlaceholder}
        className={cn(
          "group flex items-center gap-3 w-full max-w-xl mx-auto",
          "p-2 ps-3 rounded-full",
          "bg-card/90 backdrop-blur-sm border border-border/60 shadow-sm",
          "hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2",
          "transition-all duration-300",
          className,
        )}
      >
        {/* Pin */}
        <span className="shrink-0 size-10 rounded-full bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/15 group-hover:bg-violet-500/15 transition-colors">
          <MapPin className="size-4.5 text-violet-600 dark:text-violet-400" />
        </span>

        {/* Two-line label */}
        <span className="flex-1 min-w-0 flex flex-col text-start leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
            {t.search.searchBarLabel}
          </span>
          <span className="truncate text-sm font-medium text-foreground/90">
            {t.search.searchBarPlaceholder}
          </span>
        </span>

        {/* CTA */}
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 rounded-full",
            "h-10 px-3.5 sm:px-5 text-sm font-semibold",
            "bg-violet-600 text-white shadow-sm",
            "group-hover:bg-violet-600/90 group-active:scale-95 transition-all",
          )}
        >
          <Search className="size-4" />
          <span className="max-sm:hidden">{t.search.searchAction}</span>
        </span>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
