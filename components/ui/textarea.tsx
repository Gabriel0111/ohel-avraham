"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useFieldControl } from "@/components/ui/field";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  // Inside a `Field`, inherit its id + aria-describedby (no-op elsewhere).
  const fieldProps = useFieldControl({ invalid: props["aria-invalid"] });
  return (
    <textarea
      data-slot="textarea"
      {...fieldProps}
      className={cn(
        "border-input placeholder:text-muted-foreground hover:border-ring/60 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-white px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
