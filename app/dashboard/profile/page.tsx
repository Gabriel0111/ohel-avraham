"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Home, Mail, ShieldCheck, User } from "lucide-react";
import { HostProfileCard } from "./_components/host-profile-card";
import { GuestProfileCard } from "./_components/guest-profile-card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AdminNotice } from "@/app/dashboard/_components/profile-ui";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { PageSection } from "@/app/dashboard/_components/dashboard-page-ui/page-section";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { EmptyProfile } from "@/app/dashboard/_components/profile-ui/empty-profile";
import { useT } from "@/lib/i18n/context";

export default function ProfilePage() {
  const { t, lang } = useT();
  const data = useQuery(api.users.getFullProfile);

  if (data === undefined) return <ProfileLoading />;
  if (!data) return <ProfileError />;

  const { user, host, guest } = data;
  const role = user.role;
  const isBoth = role === "guest:host";
  const isHost = role === "host" || isBoth;
  const isGuest = role === "guest" || isBoth;
  const isAdmin = role === "admin";

  const joinDate = new Date(user._creationTime).toLocaleDateString(
    lang === "he" ? "he-IL" : lang === "fr" ? "fr-FR" : "en-GB",
    { month: "long", year: "numeric" }
  );

  return (
    <div>
      <PageHeader
        title={t.profile.title}
        subtitle={t.profile.subtitle}
      />

      <div className="space-y-2">
        <PageSection
          title={t.profile.personalIdentity}
          description={t.profile.personalIdentityDesc}
        >
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            {/* Avatar avec anneau de vérification */}
            <div className="relative shrink-0">
              <div
                className={`relative size-20 rounded-full overflow-hidden bg-muted shadow-sm ring-2 ${user.isVerified ? "ring-green-500/40" : "ring-border"}`}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || ""}
                    fill
                    className="object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-muted-foreground select-none">
                    {user.name?.[0].toUpperCase()}
                  </div>
                )}
              </div>
              {user.isVerified && (
                <div className="absolute bottom-0 right-0 size-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-background">
                  <CheckCircle2 className="size-3 text-white" />
                </div>
              )}
            </div>

            {/* Identité */}
            <div className="flex-1 min-w-0 space-y-3 text-center sm:text-start">
              <div className="space-y-0.5">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {user.name}
                  </h3>
                  <RoleBadge role={role} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t.profile.communityMember}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-3.5 shrink-0" />
                  <span>{t.profile.joined} {joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* SECTION : COMMUNITY PROFILES */}
        <PageSection
          title={t.profile.communityProfiles}
          description={t.profile.communityProfilesDesc}
          className="flex-col!"
          childrenClassName="w-full! pt-5"
        >
          {isBoth ? (
            <Tabs defaultValue="host" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl mb-6">
                <TabsTrigger value="host" className="rounded-lg gap-2">
                  <Home className="size-4" /> {t.profile.hostProfile}
                </TabsTrigger>
                <TabsTrigger value="guest" className="rounded-lg gap-2">
                  <User className="size-4" /> {t.profile.guestProfile}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="host"
                className="mt-0 focus-visible:outline-none"
              >
                <HostProfileCard hostData={host} />
              </TabsContent>
              <TabsContent
                value="guest"
                className="mt-0 focus-visible:outline-none"
              >
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
        </PageSection>

        {/* SECTION : VERIFICATION */}
        <PageSection
          title={t.profile.verificationStatus}
          description={t.profile.verificationStatusDesc}
        >
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${user.isVerified ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}
              >
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {user.isVerified ? t.profile.verifiedAccount : t.profile.identityPending}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.profile.manualReview}
                </p>
              </div>
            </div>
            {!user.isVerified && (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-500/30"
              >
                {t.profile.actionRequired}
              </Badge>
            )}
          </div>
        </PageSection>
      </div>
    </div>
  );
}
