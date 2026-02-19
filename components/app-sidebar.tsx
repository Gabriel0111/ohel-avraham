"use client";

import { IconDashboard, IconUserCircle, IconUsers } from "@tabler/icons-react";
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

const hostname = "/dashboard";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: hostname,
      icon: IconDashboard,
    },
    {
      title: "Account",
      url: `${hostname}/profile`,
      icon: IconUserCircle,
    },
    {
      title: "People",
      url: `${hostname}/people`,
      icon: IconUsers,
      minRole: "admin",
    },
  ],
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
