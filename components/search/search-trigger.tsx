"use client";

import { useState } from "react";
import { SearchDialog } from "./search-dialog";
import { Search } from "lucide-react";
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
        className={cn(
          "flex items-center gap-3 w-full max-w-md mx-auto px-4 py-3 rounded-full",
          "bg-card/80 backdrop-blur-sm border border-border/60",
          "text-muted-foreground text-sm",
          "hover:border-primary/30 hover:shadow-md transition-all",
          className,
        )}
      >
        <Search className="size-4 shrink-0" />
        <span>{t.search.searchBarPlaceholder}</span>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
