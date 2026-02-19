"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Home, Mail, ShieldCheck, User } from "lucide-react";
import { HostProfileCard } from "./_components/host-profile-card";
import { GuestProfileCard } from "./_components/guest-profile-card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AdminNotice } from "@/app/dashboard/_components/profile-ui";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { PageSection } from "@/app/dashboard/_components/dashboard-page-ui/page-section";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { EmptyProfile } from "@/app/dashboard/_components/profile-ui/empty-profile";

export default function ProfilePage() {
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
        title="Profile Settings"
        subtitle="Manage your identity and community presence."
      />

      <div className="space-y-2">
        <PageSection
          title="Personal Identity"
          description="How you appear to other members of the community."
        >
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative">
              <div className="relative size-14 rounded-full overflow-hidden bg-muted ring-3 ring-border shadow-sm">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-medium">
                    {user.name?.[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Membre de la communauté
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {/* Badge d'email stylisé façon Resend */}
                <Badge variant="secondary" className="flex gap-2">
                  <Mail className="size-3.5" />
                  {user.email}
                </Badge>

                <Badge variant="secondary" className="flex gap-2">
                  <Calendar className="size-3.5" />
                  Joint en Février 2024
                </Badge>
              </div>
            </div>
          </div>
        </PageSection>

        {/* SECTION : COMMUNITY PROFILES */}
        <PageSection
          title="Community Profiles"
          description="Update your specific details for hosting or joining meals."
          className="flex-col!"
          childrenClassName="w-full! pt-5"
        >
          {isBoth ? (
            <Tabs defaultValue="host" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl mb-6">
                <TabsTrigger value="host" className="rounded-lg gap-2">
                  <Home className="size-4" /> Host Profile
                </TabsTrigger>
                <TabsTrigger value="guest" className="rounded-lg gap-2">
                  <User className="size-4" /> Guest Profile
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

        {/* SECTION : ACCOUNT SECURITY (Optionnel) */}
        <PageSection
          title="Verification Status"
          description="Your current trust level on the platform."
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
                  {user.isVerified ? "Verified Account" : "Identity Pending"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Manual review by community admins.
                </p>
              </div>
            </div>
            {!user.isVerified && (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-500/30"
              >
                Action Required
              </Badge>
            )}
          </div>
        </PageSection>
      </div>
    </div>
  );
}
