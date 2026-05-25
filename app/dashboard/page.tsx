"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import { RoleBadge } from "./_components/profile-ui/role-badge";

export default function DashboardPage() {
  const { t } = useT();
  const data = useQuery(api.dashboard.getDashboardData);

  if (data === undefined) return <ProfileLoading />;
  if (data === null) return <ProfileError />;

  const stats = [
    {
      label: t.dashboard.profileSetup,
      value: data.hasProfile ? t.dashboard.complete : t.dashboard.incomplete,
      icon: data.hasProfile ? (
        <CheckCircle2 className="size-4 text-green-600" />
      ) : (
        <AlertCircle className="size-4 text-amber-500" />
      ),
      valueEl: (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          data.hasProfile
            ? "bg-green-500/10 text-green-700 dark:text-green-400"
            : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        }`}>
          {data.hasProfile ? t.dashboard.complete : t.dashboard.incomplete}
        </span>
      ),
    },
    {
      label: t.dashboard.yourRole,
      value: data.user.role,
      icon: <div className="text-primary">{getIconForRole(data.user.role)}</div>,
      valueEl: <RoleBadge role={data.user.role} />,
    },
    {
      label: t.dashboard.verification,
      value: data.user.isVerified ? t.dashboard.verified : t.dashboard.pending,
      icon: data.user.isVerified ? (
        <CheckCircle2 className="size-4 text-green-600" />
      ) : (
        <AlertCircle className="size-4 text-amber-500" />
      ),
      valueEl: (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          data.user.isVerified
            ? "bg-green-500/10 text-green-700 dark:text-green-400"
            : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        }`}>
          {data.user.isVerified ? t.dashboard.verified : t.dashboard.pending}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>

      <DashboardSection
        title={t.dashboard.accountOverview}
        description={t.dashboard.accountOverviewDesc}
        action={
          <Button variant="outline" asChild size="sm">
            <Link href="/dashboard/profile">{t.dashboard.editProfile}</Link>
          </Button>
        }
      >
        <div className="border border-border/60 rounded-2xl px-4 overflow-hidden bg-card">
          {stats.map((stat, index) => (
            <InfoRow
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              isLast={index === stats.length - 1}
              valueEl={stat.valueEl}
            />
          ))}
        </div>
      </DashboardSection>

      {data.roleInfo.isAdmin && (
        <DashboardSection
          title={t.dashboard.community}
          description={t.dashboard.communityDesc}
        >
          <ActionCard
            title={t.dashboard.browsePeople}
            subtitle={t.dashboard.adminDesc}
            href="/dashboard/people"
            icon={<Users className="size-5" />}
          />
        </DashboardSection>
      )}
    </div>
  );
}
