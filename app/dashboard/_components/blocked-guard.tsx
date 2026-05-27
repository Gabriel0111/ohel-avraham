"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ban } from "lucide-react";
import { type ReactNode } from "react";
import { useT } from "@/lib/i18n/context";

export function BlockedGuard({ children }: { children: ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);
  const { t } = useT();

  if (user?.isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-24 gap-6 text-center">
        <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center ring-4 ring-destructive/5">
          <Ban className="size-9 text-destructive" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="text-xl font-bold text-foreground">{t.blocked.title}</h2>
          <p className="text-sm text-muted-foreground">{t.blocked.desc}</p>
          <p className="text-xs text-muted-foreground/70">{t.blocked.contact}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
