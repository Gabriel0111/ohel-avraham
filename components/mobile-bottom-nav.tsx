"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBuildingCommunity,
  IconMailForward,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/app/ConvexClientProvider";
import { canAccess } from "@/convex/helpers/canAccessRole";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import type { RoleType } from "@/convex/enums";

type NavLabelKey = "account" | "communityProfile" | "requests" | "people";

interface MobileNavItem {
  url: string;
  icon: Icon;
  labelKey: NavLabelKey;
  minRole?: RoleType;
  exact?: boolean;
  withBadge?: boolean;
}

const NAV_ITEMS: MobileNavItem[] = [
  { url: "/dashboard/profile", icon: IconUserCircle, labelKey: "account" },
  {
    url: "/dashboard/community-profile",
    icon: IconBuildingCommunity,
    labelKey: "communityProfile",
  },
  {
    url: "/dashboard/requests",
    icon: IconMailForward,
    labelKey: "requests",
    withBadge: true,
  },
  {
    url: "/dashboard/people",
    icon: IconUsers,
    labelKey: "people",
    minRole: "admin",
  },
];

function getLabel(key: NavLabelKey, t: ReturnType<typeof useT>["t"]): string {
  if (key === "people") return t.people.title;
  return t.nav[key];
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useT();
  const pendingCount = useQuery(api.requests.getIncomingPendingCount) ?? 0;

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.minRole) return true;
    return canAccess(user?.role ?? "guest", item.minRole);
  });

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/50 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around px-4 pt-2 pb-6">
        {visibleItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.url
            : pathname.startsWith(item.url);
          const badge = item.withBadge ? pendingCount : 0;

          return (
            <Link
              key={item.url}
              href={item.url}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-col items-center gap-1 min-w-14 py-0.5"
            >
              {isActive && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
              )}

              <div
                className={cn(
                  "relative flex items-center justify-center size-9 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className="size-[21px]"
                  stroke={isActive ? 2.5 : 1.5}
                />
                {badge > 0 && (
                  <span className="absolute -top-1 -end-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tabular-nums ring-2 ring-background">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] leading-none font-medium tracking-wide transition-colors",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {getLabel(item.labelKey, t)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
