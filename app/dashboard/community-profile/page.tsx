"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User } from "lucide-react";
import { HostProfileCard } from "@/app/dashboard/profile/_components/host-profile-card";
import { GuestProfileCard } from "@/app/dashboard/profile/_components/guest-profile-card";
import { AdminNotice } from "@/app/dashboard/_components/profile-ui";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { EmptyProfile } from "@/app/dashboard/_components/profile-ui/empty-profile";
import { useT } from "@/lib/i18n/context";

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

      {/* Cartes d'édition */}
      <div className="pt-2">
        {isBoth ? (
          <Tabs defaultValue="host" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl mb-6">
              <TabsTrigger value="host" className="rounded-lg gap-2 data-[state=active]:text-violet-600">
                <Home className="size-4" />{t.profile.hostProfile}
              </TabsTrigger>
              <TabsTrigger value="guest" className="rounded-lg gap-2 data-[state=active]:text-emerald-600">
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
