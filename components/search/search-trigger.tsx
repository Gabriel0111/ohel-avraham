"use client";

import { useState } from "react";
import { SearchDialog } from "./search-dialog";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Hosts (and dual guest:host) search for guests; everyone else searches hosts.
function useGuestMode() {
  const currentUser = useQuery(api.users.getCurrentUser);
  return (
    currentUser?.role === "host" || currentUser?.role === "guest:host"
  );
}

interface SearchTriggerButtonProps {
  className?: string;
}

export function SearchTriggerButton({ className }: SearchTriggerButtonProps) {
  const [open, setOpen] = useState(false);
  const { t } = useT();
  const guestMode = useGuestMode();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className={cn("size-9", className)}
        aria-label={guestMode ? t.search.guestTitle : t.search.title}
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
  const guestMode = useGuestMode();
  const placeholder = guestMode
    ? t.search.searchGuestsBarPlaceholder
    : t.search.searchBarPlaceholder;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={placeholder}
        className={cn(
          "group flex items-center gap-3 w-full max-w-xl mx-auto cursor-pointer",
          "p-2 ps-3 rounded-full",
          "bg-card/90 backdrop-blur-sm border border-border/60 shadow-sm",
          "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          "transition-all duration-300",
          className,
        )}
      >
        {/* Pin */}
        <span className="shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/15 group-hover:bg-primary/15 transition-colors">
          <MapPin className="size-4.5 text-primary" />
        </span>

        {/* Two-line label */}
        <span className="flex-1 min-w-0 flex flex-col text-start leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
            {t.search.searchBarLabel}
          </span>
          <span className="truncate text-sm font-medium text-foreground/90">
            {placeholder}
          </span>
        </span>

        {/* CTA */}
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 rounded-full",
            "h-10 px-3.5 sm:px-5 text-sm font-semibold",
            "bg-primary text-white shadow-sm",
            "group-hover:bg-primary/90 group-active:scale-95 transition-all",
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
