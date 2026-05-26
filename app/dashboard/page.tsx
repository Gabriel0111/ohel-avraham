"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Calendar,
  Home,
  Mail,
  MapPin,
  Settings,
  Users,
  X,
} from "lucide-react";
import { ActionCard, DashboardSection, getIconForRole } from "./_components/dashboard-ui";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { VerificationStatus } from "@/app/dashboard/_components/profile-ui/verification-status";
import { useT } from "@/lib/i18n/context";
import { RoleBadge } from "./_components/profile-ui/role-badge";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { IconBuildingCommunity, IconUserCircle } from "@tabler/icons-react";

export default function DashboardPage() {
  const { t, lang } = useT();
  const data = useQuery(api.users.getFullProfile);

  if (data === undefined) return <ProfileLoading />;
  if (data === null) return <ProfileError />;

  const { user, host, guest } = data;
  const role = user.role;
  const isHost = role === "host" || role === "guest:host";
  const isGuest = role === "guest" || role === "guest:host";
  const isAdmin = role === "admin";
  const hasProfile = isHost ? !!host : isGuest ? !!guest : true;

  const joinDate = new Date(user._creationTime).toLocaleDateString(
    lang === "he" ? "he-IL" : lang === "fr" ? "fr-FR" : "en-GB",
    { month: "long", year: "numeric" },
  );

  return (
    <div>
      {/* TITRE */}
      <h1 className="text-3xl font-bold tracking-tight mb-0">{t.dashboard.title}</h1>

      {/* SECTION 1 : IDENTITÉ + STATUT */}
      <DashboardSection
        title={t.dashboard.accountOverview}
        description={t.dashboard.accountOverviewDesc}
        action={
          <Button variant="outline" asChild size="sm">
            <Link href="/dashboard/profile">{t.dashboard.editProfile}</Link>
          </Button>
        }
      >
        <div className="space-y-4">
          {/* Carte identité */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="relative shrink-0">
              <div className="size-14 rounded-full overflow-hidden bg-muted ring-2 ring-border">
                {user.image ? (
                  <Image src={user.image} alt={user.name || ""} fill className="object-cover" draggable={false} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground select-none">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-semibold text-base leading-tight truncate">{user.name}</span>
                <RoleBadge role={role} />
              </div>
              <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="size-3 shrink-0" />{user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3 shrink-0" />{t.profile.joined} {joinDate}
                </span>
              </div>
            </div>
            <div className="shrink-0 hidden sm:block text-muted-foreground/60">
              {getIconForRole(role)}
            </div>
          </div>

          {/* Statut vérification unifié */}
          <VerificationStatus isVerified={user.isVerified} />

          {/* Profil communautaire configuré ? */}
          {(isHost || isGuest) && !hasProfile && (
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border bg-muted/20">
              <p className="text-sm text-muted-foreground">{t.dashboard.noProfileYet}</p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard/community-profile">{t.dashboard.setupProfile}</Link>
              </Button>
            </div>
          )}
        </div>
      </DashboardSection>

      {/* SECTION 2 : RÉSUMÉ PROFIL COMMUNAUTAIRE */}
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
              <Badge variant="secondary">{host.kashrout}</Badge>
              <Badge variant="secondary">{host.sector}</Badge>
              <Badge variant="secondary">{host.ethnicity}</Badge>
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
              <Badge variant="secondary">{guest.gender}</Badge>
              <Badge variant="secondary">{guest.sector}</Badge>
              <Badge variant="secondary">{guest.ethnicity}</Badge>
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
