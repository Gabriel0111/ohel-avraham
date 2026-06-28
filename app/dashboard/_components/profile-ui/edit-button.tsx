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
 * The single edit affordance used across the dashboard: a compact brand
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
        "h-8 gap-1.5 rounded-lg border-primary/30 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/15",
        className,
      )}
    >
      <Pencil className="size-3.5" />
      {label ?? t.common.edit}
    </Button>
  );
}
