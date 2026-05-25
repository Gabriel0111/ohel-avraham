"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Icon } from "@tabler/icons-react";
import { useAuth } from "@/app/ConvexClientProvider";
import { RoleType } from "@/convex/enums";
import { canAccess } from "@/convex/helpers/canAccessRole";

type SidebarNavProps = {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    minRole?: RoleType | undefined;
  }[];
};

export function SidebarNav({ items }: SidebarNavProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const filteredItems = items.filter((item) => {
    if (!item.minRole) return true;
    return canAccess(user?.role ?? "guest", item.minRole);
  });

  return (
    <nav className="flex flex-col gap-0.5 px-2">
      {filteredItems.map((item) => {
        const isActive =
          item.url === "/dashboard"
            ? pathname === item.url
            : pathname.startsWith(item.url);

        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
              "transition-all duration-200 ease-in-out",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80",
                )}
                stroke={isActive ? 2.2 : 1.6}
              />
            )}
            <span className="transition-colors duration-200">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
