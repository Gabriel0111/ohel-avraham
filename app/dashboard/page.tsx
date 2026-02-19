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

export default function DashboardPage() {
  const data = useQuery(api.dashboard.getDashboardData);

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: "Profile Setup",
        value: data.hasProfile ? "Complete" : "Incomplete",
        icon: data.hasProfile ? (
          <CheckCircle2 className="size-5 text-green-600" />
        ) : (
          <AlertCircle className="size-5 text-amber-500" />
        ),
      },
      {
        label: "Your Role",
        value: data.user.role,
        icon: (
          <div className="text-primary">{getIconForRole(data.user.role)}</div>
        ),
        capitalize: true,
      },
      {
        label: "Verification",
        value: data.user.isVerified ? "Verified" : "Pending",
        icon: data.user.isVerified ? (
          <CheckCircle2 className="size-5 text-green-600" />
        ) : (
          <AlertCircle className="size-5 text-amber-500" />
        ),
      },
    ];
  }, [data]);

  if (data === undefined) return <ProfileLoading />;
  if (data === null) return <ProfileError />;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <DashboardSection
        title="Account Overview"
        description="Manage your profile status and community permissions."
        action={
          <Button
            variant="outline"
            className="rounded-xl shadow-sm bg-background"
            asChild
          >
            <Link href="/dashboard/profile">Edit Profile</Link>
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
        title="Community"
        description="Connect with other members of the community."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard
            title="Browse People"
            subtitle={
              data.roleInfo.isHost
                ? "See guests looking for meals"
                : "Find hosts near you"
            }
            href="/dashboard/people"
            icon={<Users className="size-5" />}
          />
        </div>
      </DashboardSection>
    </div>
  );
}
