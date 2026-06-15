"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users } from "lucide-react";
import { ActionCard } from "./_components/dashboard-ui";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { PageSection } from "@/app/dashboard/_components/dashboard-page-ui/page-section";
import { CommunityHero } from "./community-profile/_components/community-hero";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { useT } from "@/lib/i18n/context";
import { IconBuildingCommunity, IconUserCircle } from "@tabler/icons-react";

export default function DashboardPage() {
  const { t } = useT();
  const data = useQuery(api.users.getFullProfile);

  if (data === undefined) return <ProfileLoading />;
  if (data === null) return <ProfileError />;

  const { user, host, guest } = data;
  const role = user.role;
  const isBoth = role === "guest:host";
  const isHost = role === "host" || isBoth;
  const isGuest = role === "guest" || isBoth;
  const isAdmin = role === "admin";
  const hasProfile = (isHost && !!host) || (isGuest && !!guest);

  return (
    <div>
      <PageHeader
        title={t.dashboard.title}
        subtitle={`${t.dashboard.welcome} ${user.name ?? ""}`.trim()}
      />

      {/* RÉSUMÉ — source unique : CommunityHero */}
      {hasProfile && <CommunityHero user={user} host={host} guest={guest} />}

      {/* ACTIONS RAPIDES */}
      <PageSection title={t.dashboard.quickActions}>
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
      </PageSection>
    </div>
  );
}
