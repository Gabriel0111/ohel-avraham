"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Doc } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";

export function NavUser({ user }: { user: Doc<"users"> | null | undefined }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Déconnexion réussie");
          router.push("/");
        },
      },
    });
  };

  // 1. État de chargement (Skeleton)
  if (user === undefined) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer transition-all"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-border">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {user.name?.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{user.name}</span>
                  <RoleBadge role={user.role} />
                </div>
                <span className="text-muted-foreground truncate text-xs font-normal">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-muted-foreground/50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl p-2"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex items-center justify-between space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                {/*<p className="text-xs leading-none text-muted-foreground italic">*/}
                {/*  Compte {user.role}*/}
                {/*</p>*/}
                <RoleBadge role={user.role} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
                className="cursor-pointer gap-3 rounded-lg"
              >
                <IconUserCircle className="size-4 text-muted-foreground" />
                Mon Profil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer gap-3 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <IconLogout className="size-4 text-destructive" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
