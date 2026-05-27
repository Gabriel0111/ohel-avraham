"use client";

import { useState, useTransition } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calendar, CheckCircle2, Mail, MailCheck, Pencil } from "lucide-react";
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
import { EditIdentity } from "./_components/edit-identity";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ProfilePage() {
  const { t, lang } = useT();
  const data = useQuery(api.users.getFullProfile);
  const session = authClient.useSession();
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isSendingVerif, startSendingVerif] = useTransition();

  if (data === undefined) return <ProfileLoading />;
  if (!data) return <ProfileError />;

  const { user } = data;
  const emailVerified = session.data?.user.emailVerified ?? false;

  const joinDate = new Date(user._creationTime).toLocaleDateString(
    lang === "he" ? "he-IL" : lang === "fr" ? "fr-FR" : "en-GB",
    { month: "long", year: "numeric" },
  );

  const handleSendVerification = () => {
    if (!user.email) return;
    startSendingVerif(async () => {
      const { error } = await authClient.sendVerificationEmail({
        email: user.email!,
        callbackURL: "/dashboard/profile",
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t.profile.verifyEmailSent);
      }
    });
  };

  return (
    <div>
      <PageHeader title={t.profile.title} subtitle={t.profile.subtitle} />

      <div className="space-y-2">

        {/* IDENTITÉ PERSONNELLE */}
        <PageSection
          title={t.profile.personalIdentity}
          description={t.profile.personalIdentityDesc}
        >
          {isEditingIdentity ? (
            <EditIdentity
              user={user}
              onDone={() => setIsEditingIdentity(false)}
              onCancel={() => setIsEditingIdentity(false)}
            />
          ) : (
            <div className="flex gap-4 items-start">
              {/* Avatar cliquable */}
              <button
                type="button"
                onClick={() => setIsEditingIdentity(true)}
                className="relative shrink-0 group focus:outline-none"
                title={t.profile.uploadImage}
              >
                <div className={`relative size-20 rounded-full overflow-hidden bg-muted shadow-sm ring-2 ${user.isVerified ? "ring-green-500/40" : "ring-border"}`}>
                  {user.image ? (
                    <Image src={user.image} alt={user.name || ""} fill className="object-cover" draggable={false} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-muted-foreground select-none">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Pencil className="size-4 text-white" />
                </div>
                {user.isVerified && (
                  <div className="absolute bottom-0 right-0 size-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-background">
                    <CheckCircle2 className="size-3 text-white" />
                  </div>
                )}
              </button>

              {/* Infos */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold tracking-tight text-foreground leading-tight">{user.name}</h3>
                  <RoleBadge role={user.role} />
                  <button
                    type="button"
                    onClick={() => setIsEditingIdentity(true)}
                    className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                    title={t.profile.editIdentity}
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-3.5 shrink-0" />
                    <span>{t.profile.joined} {joinDate}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </PageSection>

        {/* STATUT DE VÉRIFICATION */}
        <PageSection
          title={t.profile.verificationStatus}
          description={t.profile.verificationStatusDesc}
        >
          <div className="space-y-3">
            <VerificationStatus
              isVerified={user.isVerified}
              isAdmin={user.role === "admin"}
              verifiedBy={user.verifiedBy}
              verifiedAt={user.verifiedAt}
            />

            {/* Email vérifié */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${emailVerified ? "border-green-500/20 bg-green-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${emailVerified ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600"}`}>
                  <MailCheck className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {emailVerified ? t.profile.emailVerifiedTitle : t.profile.emailNotVerifiedTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {emailVerified ? t.profile.emailVerifiedDesc : t.profile.emailNotVerifiedDesc}
                  </p>
                </div>
              </div>
              {!emailVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendVerification}
                  disabled={isSendingVerif}
                  className="gap-2 shrink-0"
                >
                  {isSendingVerif ? (
                    <><Spinner className="size-3" />{t.profile.verifyEmailSending}</>
                  ) : (
                    t.profile.verifyEmail
                  )}
                </Button>
              )}
            </div>
          </div>
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
