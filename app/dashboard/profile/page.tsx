"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calendar, CheckCircle2, Mail } from "lucide-react";
import Image from "next/image";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { PageSection } from "@/app/dashboard/_components/dashboard-page-ui/page-section";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { useT } from "@/lib/i18n/context";
import { LinkedAccounts } from "./_components/linked-accounts";
import { DeleteAccount } from "./_components/delete-account";
import { VerificationStatus } from "@/app/dashboard/_components/profile-ui/verification-status";

export default function ProfilePage() {
  const { t, lang } = useT();
  const data = useQuery(api.users.getFullProfile);

  if (data === undefined) return <ProfileLoading />;
  if (!data) return <ProfileError />;

  const { user } = data;

  const joinDate = new Date(user._creationTime).toLocaleDateString(
    lang === "he" ? "he-IL" : lang === "fr" ? "fr-FR" : "en-GB",
    { month: "long", year: "numeric" },
  );

  return (
    <div>
      <PageHeader title={t.profile.title} subtitle={t.profile.subtitle} />

      <div className="space-y-2">

        {/* IDENTITÉ PERSONNELLE */}
        <PageSection
          title={t.profile.personalIdentity}
          description={t.profile.personalIdentityDesc}
        >
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="relative shrink-0">
              <div className={`relative size-20 rounded-full overflow-hidden bg-muted shadow-sm ring-2 ${user.isVerified ? "ring-green-500/40" : "ring-border"}`}>
                {user.image ? (
                  <Image src={user.image} alt={user.name || ""} fill className="object-cover" draggable={false} />
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

            <div className="flex-1 min-w-0 space-y-3 text-center sm:text-start">
              <div className="space-y-0.5">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{user.name}</h3>
                  <RoleBadge role={user.role} />
                </div>
                <p className="text-sm text-muted-foreground">{t.profile.communityMember}</p>
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

        {/* STATUT DE VÉRIFICATION */}
        <PageSection
          title={t.profile.verificationStatus}
          description={t.profile.verificationStatusDesc}
        >
          <VerificationStatus isVerified={user.isVerified} />
        </PageSection>

        {/* COMPTES CONNECTÉS */}
        <PageSection
          title={t.profile.linkedAccounts}
          description={t.profile.linkedAccountsDesc}
        >
          <LinkedAccounts />
        </PageSection>

        {/* ZONE DE DANGER */}
        <PageSection
          title={t.profile.dangerZone}
          description={t.profile.dangerZoneDesc}
        >
          <DeleteAccount />
        </PageSection>

      </div>
    </div>
  );
}
