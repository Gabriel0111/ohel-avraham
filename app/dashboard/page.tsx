"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Users } from "lucide-react";
import {
  ActionCard,
  DashboardSection,
  getIconForRole,
  InfoRow,
} from "./_components/dashboard-ui";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { useT } from "@/lib/i18n/context";

export default function DashboardPage() {
  const { t } = useT();
  const data = useQuery(api.dashboard.getDashboardData);

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: t.dashboard.profileSetup,
        value: data.hasProfile ? t.dashboard.complete : t.dashboard.incomplete,
        icon: data.hasProfile ? (
          <CheckCircle2 className="size-5 text-green-600" />
        ) : (
          <AlertCircle className="size-5 text-amber-500" />
        ),
      },
      {
        label: t.dashboard.yourRole,
        value: data.user.role,
        icon: (
          <div className="text-primary">{getIconForRole(data.user.role)}</div>
        ),
        capitalize: true,
      },
      {
        label: t.dashboard.verification,
        value: data.user.isVerified ? t.dashboard.verified : t.dashboard.pending,
        icon: data.user.isVerified ? (
          <CheckCircle2 className="size-5 text-green-600" />
        ) : (
          <AlertCircle className="size-5 text-amber-500" />
        ),
      },
    ];
  }, [data, t]);

  if (data === undefined) return <ProfileLoading />;
  if (data === null) return <ProfileError />;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>

      <DashboardSection
        title={t.dashboard.accountOverview}
        description={t.dashboard.accountOverviewDesc}
        action={
          <Button variant="outline" asChild>
            <Link href="/dashboard/profile">{t.dashboard.editProfile}</Link>
          </Button>
        }
      >
        <div className="bg-card/40 border border-border/60 rounded-2xl px-4 overflow-hidden">
          {stats.map((stat, index) => (
            <InfoRow
              key={stat.label}
              {...stat}
              isLast={index === stats.length - 1}
            />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title={t.dashboard.community}
        description={t.dashboard.communityDesc}
      >
        <div className="">
          <ActionCard
            title={t.dashboard.browsePeople}
            subtitle={
              data.roleInfo.isHost
                ? t.dashboard.seeGuests
                : t.dashboard.findHosts
            }
            href="/dashboard/people"
            icon={<Users className="size-5" />}
          />
        </div>
      </DashboardSection>
    </div>
  );
}
