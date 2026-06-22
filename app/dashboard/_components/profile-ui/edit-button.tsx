"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

interface EditButtonProps {
  onClick: () => void;
  /** Defaults to the localized "Edit" label. */
  label?: string;
  className?: string;
}

/**
 * The single edit affordance used across the dashboard: a compact violet
 * outline button with a pencil. Keeps every "edit this section" trigger
 * visually identical (profile identity, host card, guest card).
 */
export function EditButton({ onClick, label, className }: EditButtonProps) {
  const { t } = useT();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 gap-1.5 rounded-lg border-violet-500/30 text-violet-700 hover:bg-violet-500/10 hover:text-violet-700 dark:border-violet-500/30 dark:text-violet-300 dark:hover:bg-violet-500/15",
        className,
      )}
    >
      <Pencil className="size-3.5" />
      {label ?? t.common.edit}
    </Button>
  );
}
