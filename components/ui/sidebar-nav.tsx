"use client";

import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Icon } from "@tabler/icons-react";
import { useAuth } from "@/app/ConvexClientProvider";
import { RoleType } from "@/convex/enums";
import { canAccess } from "@/convex/helpers/canAccessRole";

type SidebarNavProps = HTMLAttributes<HTMLElement> & {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    minRole?: RoleType | undefined;
  }[];
};

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { user } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const [val, setVal] = useState(pathname ?? "/settings");

  const handleSelect = (e: string) => {
    setVal(e);
    router.push(e);
  };

  const filteredItemsByRole = items.filter((item) => {
    if (!item.minRole) return true;

    return canAccess(user?.role ?? "guest", item.minRole);
  });

  return (
    <>
      <div className="md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {filteredItemsByRole.map((item) => (
              <SelectItem key={item.url} value={item.url}>
                <div className="flex items-center gap-x-4 px-2 py-1">
                  <span className="scale-125">
                    {item.icon && <item.icon />}
                  </span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        aria-orientation="horizontal"
        type="always"
        className="hidden w-full bg-background py-2 md:block"
      >
        <nav className={cn("flex flex-col space-y-1", className)} {...props}>
          {filteredItemsByRole.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.url
                  ? "bg-gray-400/40 hover:bg-gray-400/50"
                  : "hover:bg-gray-400/50 text-muted-foreground/80",
                "justify-start rounded-md",
              )}
            >
              <span className="me-0 scale-110">
                {item.icon && <item.icon />}
              </span>
              <span> {item.title}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
