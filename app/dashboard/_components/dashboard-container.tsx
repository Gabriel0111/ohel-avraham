"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

// Most dashboard pages are centered at a comfortable reading width; a few
// (data-dense tables) opt out and use the full inset width instead.
const FULL_WIDTH_PREFIXES = ["/dashboard/people"];

export function DashboardContainer({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const fullWidth = FULL_WIDTH_PREFIXES.some((p) => pathname.startsWith(p));
  return (
    <div
      className={cn(
        "@container/main flex flex-1 flex-col gap-2 mx-auto w-full px-4 md:px-6 py-6 md:py-8 pb-8 md:pb-6",
        fullWidth ? "max-w-none" : "max-w-6xl",
      )}
    >
      {children}
    </div>
  );
}
