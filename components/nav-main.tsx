"use client";

import type { Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { JSX } from "react";

interface Props {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}

export function NavMain({ items }: Props): JSX.Element {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarNav items={items} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
