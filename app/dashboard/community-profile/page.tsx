"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accessibility, Home, MapPin, User, X } from "lucide-react";
import { HostProfileCard } from "@/app/dashboard/profile/_components/host-profile-card";
import { GuestProfileCard } from "@/app/dashboard/profile/_components/guest-profile-card";
import { AdminNotice } from "@/app/dashboard/_components/profile-ui";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { EmptyProfile } from "@/app/dashboard/_components/profile-ui/empty-profile";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { useT } from "@/lib/i18n/context";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function CommunityProfilePage() {
  const { t } = useT();
  const data = useQuery(api.users.getFullProfile);

  if (data === undefined) return <ProfileLoading />;
  if (!data) return <ProfileError />;

  const { user, host, guest } = data;
  const role = user.role;
  const isBoth = role === "guest:host";
  const isHost = role === "host" || isBoth;
  const isGuest = role === "guest" || isBoth;
  const isAdmin = role === "admin";

  return (
    <div>
      <PageHeader
        title={t.profile.communityProfiles}
        subtitle={t.profile.communityProfilesDesc}
      />

      {/* Aperçu public */}
      {(isHost || isGuest) && (
        <div className="mb-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full overflow-hidden bg-muted ring-2 ring-border shrink-0">
              {user.image ? (
                <Image src={user.image} alt={user.name || ""} width={56} height={56} className="object-cover" draggable={false} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground select-none">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-base">{user.name}</span>
                <RoleBadge role={role} />
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {isHost && host && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="truncate max-w-48">{host.address}</span>
                  </span>
                )}
                {isGuest && guest && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0" />
                    {guest.region}
                  </span>
                )}
              </div>
            </div>

            {/* Badges résumé */}
            <div className="hidden sm:flex flex-wrap gap-1.5 justify-end max-w-48">
              {isHost && host && (
                <>
                  <Badge variant="secondary">{host.kashrout}</Badge>
                  <Badge variant="secondary">{host.sector}</Badge>
                  {host.hasDisabilityAccess && (
                    <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-normal gap-1">
                      <Accessibility className="size-3" />{t.hostProfile.stepFreeAccess}
                    </Badge>
                  )}
                </>
              )}
              {isGuest && guest && !isBoth && (
                <>
                  <Badge variant="secondary">{guest.gender}</Badge>
                  <Badge variant="secondary">{guest.sector}</Badge>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cartes d'édition */}
      <div className="pt-2">
        {isBoth ? (
          <Tabs defaultValue="host" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl mb-6">
              <TabsTrigger value="host" className="rounded-lg gap-2">
                <Home className="size-4" />{t.profile.hostProfile}
              </TabsTrigger>
              <TabsTrigger value="guest" className="rounded-lg gap-2">
                <User className="size-4" />{t.profile.guestProfile}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="host" className="mt-0 focus-visible:outline-none">
              <HostProfileCard hostData={host} />
            </TabsContent>
            <TabsContent value="guest" className="mt-0 focus-visible:outline-none">
              <GuestProfileCard guestData={guest} />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {isHost && <HostProfileCard hostData={host} />}
            {isGuest && <GuestProfileCard guestData={guest} />}
            {isAdmin && <AdminNotice role={role} />}
            {!isHost && !isGuest && !isAdmin && <EmptyProfile />}
          </>
        )}
      </div>
    </div>
  );
}
