"use client";

import {
  Icon,
  IconBuildingCommunity,
  IconMailForward,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";
import { useAuth } from "@/app/ConvexClientProvider";
import { ComponentProps } from "react";
import Link from "next/link";
import { RoleType } from "@/convex/enums";
import { useT } from "@/lib/i18n/context";

const hostname = "/dashboard";

interface NavItem {
  title: string;
  url: string;
  icon?: Icon;
  minRole?: RoleType;
  badge?: number;
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { t, lang } = useT();
  const pendingCount = useQuery(api.requests.getIncomingPendingCount);

  const items: NavItem[] = [
    {
      title: t.nav.account,
      url: `${hostname}/profile`,
      icon: IconUserCircle,
    },
    {
      title: t.nav.communityProfile,
      url: `${hostname}/community-profile`,
      icon: IconBuildingCommunity,
    },
    {
      title: t.nav.requests,
      url: `${hostname}/requests`,
      icon: IconMailForward,
      badge: pendingCount ?? 0,
    },
    {
      title: t.nav.people,
      url: `${hostname}/people`,
      icon: IconUsers,
      minRole: "admin",
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" side={lang === "he" ? "right" : "left"} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-6 pt-2">
            <Link href="/">
              <Logo />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} pendingCount={pendingCount ?? 0} />
      </SidebarFooter>
    </Sidebar>
  );
}
