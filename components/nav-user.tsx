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
  DropdownMenuItem,
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

export function NavUser({
  user,
  pendingCount = 0,
}: {
  user: Doc<"users"> | null | undefined;
  pendingCount?: number;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const hasNewRequest = pendingCount > 0;

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
              <div className="relative shrink-0">
                <Avatar className="h-8 w-8 rounded-lg border border-border">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    {user.name?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                {hasNewRequest && (
                  <span
                    role="status"
                    className="absolute -top-1 -end-1 flex size-3"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 motion-reduce:hidden" />
                    <span className="relative inline-flex size-3 rounded-full bg-primary ring-2 ring-sidebar" />
                    <span className="sr-only">
                      {pendingCount > 1
                        ? `${pendingCount} nouvelles demandes`
                        : "Nouvelle demande"}
                    </span>
                  </span>
                )}
              </div>

              <div className="grid flex-1 text-start text-sm leading-tight ms-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-semibold">{user.name}</span>
                  <RoleBadge role={user.role} />
                </div>
                <span className="text-muted-foreground truncate text-xs font-normal">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ms-auto size-4 text-muted-foreground/50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-48 rounded-xl p-1.5"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer gap-3 rounded-lg"
            >
              <IconUserCircle className="size-4 text-muted-foreground" />
              Mon Profil
            </DropdownMenuItem>
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
