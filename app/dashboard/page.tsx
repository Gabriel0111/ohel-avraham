"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Accessibility, ArrowRight, MapPin, Users, X } from "lucide-react";
import { ActionCard, DashboardSection } from "./_components/dashboard-ui";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import { Badge } from "@/components/ui/badge";
import { IconBuildingCommunity, IconUserCircle } from "@tabler/icons-react";

export default function DashboardPage() {
  const { t } = useT();
  const el = useEnumLabel();
  const data = useQuery(api.users.getFullProfile);

  if (data === undefined) return <ProfileLoading />;
  if (data === null) return <ProfileError />;

  const { user, host, guest } = data;
  const role = user.role;
  const isHost = role === "host" || role === "guest:host";
  const isGuest = role === "guest" || role === "guest:host";
  const isAdmin = role === "admin";

  return (
    <div>
      {/* TITRE */}
      <h1 className="text-3xl font-bold tracking-tight mb-0">{t.dashboard.title}</h1>

      {/* SECTION 1 : RÉSUMÉ PROFIL COMMUNAUTAIRE */}
      {(isHost && host) && (
        <DashboardSection
          title={t.profile.hostProfile}
          description={t.profile.communityProfilesDesc}
          action={
            <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
              <Link href="/dashboard/community-profile">
                {t.common.edit} <ArrowRight className="size-3" />
              </Link>
            </Button>
          }
        >
          <div className="rounded-xl border border-border bg-card divide-y divide-border/40 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <MapPin className="size-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground flex-1 truncate">{host.address}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
              <Badge variant="secondary">{el.kashrout(host.kashrout)}</Badge>
              <Badge variant="secondary">{el.sector(host.sector)}</Badge>
              <Badge variant="secondary">{el.ethnicity(host.ethnicity)}</Badge>
              {host.hasDisabilityAccess ? (
                <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-normal gap-1">
                  <Accessibility className="size-3" />{t.hostProfile.stepFreeAccess}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground gap-1 font-normal">
                  <X className="size-3" />{t.hostProfile.noSpecializedAccess}
                </Badge>
              )}
            </div>
          </div>
        </DashboardSection>
      )}

      {(isGuest && guest) && (
        <DashboardSection
          title={t.profile.guestProfile}
          description={t.profile.communityProfilesDesc}
          action={
            <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
              <Link href="/dashboard/community-profile">
                {t.common.edit} <ArrowRight className="size-3" />
              </Link>
            </Button>
          }
        >
          <div className="rounded-xl border border-border bg-card divide-y divide-border/40 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <MapPin className="size-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground flex-1 truncate">{guest.region}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
              <Badge variant="secondary">{el.gender(guest.gender)}</Badge>
              <Badge variant="secondary">{el.sector(guest.sector)}</Badge>
              <Badge variant="secondary">{el.ethnicity(guest.ethnicity)}</Badge>
            </div>
          </div>
        </DashboardSection>
      )}

      {/* SECTION 3 : ACTIONS RAPIDES */}
      <DashboardSection title={t.dashboard.quickActions}>
        <div className="flex flex-col gap-3">
          <ActionCard
            title={t.nav.account}
            subtitle={t.dashboard.accountCard}
            href="/dashboard/profile"
            icon={<IconUserCircle className="size-5" />}
          />
          {(isHost || isGuest) && (
            <ActionCard
              title={t.nav.communityProfile}
              subtitle={t.dashboard.communityCard}
              href="/dashboard/community-profile"
              icon={<IconBuildingCommunity className="size-5" />}
            />
          )}
          {isAdmin && (
            <ActionCard
              title={t.nav.people}
              subtitle={t.dashboard.adminDesc}
              href="/dashboard/people"
              icon={<Users className="size-5" />}
            />
          )}
        </div>
      </DashboardSection>
    </div>
  );
}
