import type React from "react";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <h1 className={cn("text-2xl font-bold tracking-tight", className)}>
      Ohel<span className="text-primary">Avraham</span>
    </h1>
  );
};
