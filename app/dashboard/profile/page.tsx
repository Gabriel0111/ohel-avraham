"use client";

import { useEffect, useState, useTransition } from "react";
import { useFullProfile } from "@/app/dashboard/_components/profile-provider";
import { Calendar, CheckCircle2, MailCheck } from "lucide-react";
import { EnumPill } from "@/components/ui/enum-pill";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { EditButton } from "@/app/dashboard/_components/profile-ui/edit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { PageSection } from "@/app/dashboard/_components/dashboard-page-ui/page-section";
import { ProfileLoading } from "@/app/dashboard/_components/profile-ui/profile-loading";
import { ProfileError } from "@/app/dashboard/_components/profile-ui/profile-error";
import { useErrorMessage, useT } from "@/lib/i18n/context";
import { LinkedAccounts } from "./_components/linked-accounts";
import { DeleteAccount } from "./_components/delete-account";
import { VerificationStatus } from "@/app/dashboard/_components/profile-ui/verification-status";
import { EditIdentity } from "./_components/edit-identity";
import { EmailVerificationSkeleton } from "./_components/email-verification-skeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ProfilePage() {
  const { t, lang } = useT();
  const getErrorMessage = useErrorMessage();
  const data = useFullProfile();
  const session = authClient.useSession();
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isSendingVerif, startSendingVerif] = useTransition();
  const [hasPasswordAccount, setHasPasswordAccount] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    authClient.listAccounts().then((res) => {
      if (res.data) {
        setHasPasswordAccount(
          (res.data as { providerId: string }[]).some(
            (a) => a.providerId === "credential",
          ),
        );
      } else {
        setHasPasswordAccount(false);
      }
    });
  }, []);

  if (data === undefined) return <ProfileLoading />;
  if (!data) return <ProfileError />;

  const { user } = data;
  const emailVerified = session.data?.user.emailVerified ?? false;
  // Both the session and the linked-accounts lookup resolve asynchronously;
  // until they do we show a skeleton instead of letting the card pop in.
  const emailInfoLoading = session.isPending || hasPasswordAccount === null;

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
        toast.error(getErrorMessage(error));
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
              <Avatar
                className={cn(
                  "size-20 shrink-0 shadow-sm ring-2",
                  user.isVerified ? "ring-green-500/40" : "ring-border",
                )}
              >
                <AvatarImage src={user.image} alt={user.name ?? ""} />
                <AvatarFallback className="bg-muted text-3xl font-semibold text-muted-foreground">
                  {user.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Infos */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold tracking-tight text-foreground leading-tight">
                    {user.name}
                  </h3>
                  <RoleBadge role={user.role} />
                  <EditButton
                    onClick={() => setIsEditingIdentity(true)}
                    label={t.profile.editIdentity}
                    className="ms-auto"
                  />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <Calendar className="size-3.5 shrink-0" />
                  <span>
                    {t.profile.joined} {joinDate}
                  </span>
                </span>
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
            {user.role !== "admin" && (
              <VerificationStatus
                isVerified={user.isVerified}
                verifiedBy={user.verifiedBy}
                verifiedAt={user.verifiedAt}
              />
            )}
          </div>
        </PageSection>

        {/* VÉRIFICATION DE L'EMAIL */}
        {(emailInfoLoading || hasPasswordAccount) && (
          <PageSection
            title={t.profile.emailVerification}
            description={t.profile.emailVerificationDesc}
          >
            {emailInfoLoading ? (
              <EmailVerificationSkeleton />
            ) : (
              <div
                className={`flex items-center justify-between p-4 rounded-xl border ${emailVerified ? "border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent" : "border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${emailVerified ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600"}`}
                  >
                    <MailCheck className="size-4" />
                  </div>
                  <p className="text-sm font-medium">
                    {emailVerified
                      ? t.profile.emailVerifiedTitle
                      : t.profile.emailNotVerifiedTitle}
                  </p>
                </div>
                {emailVerified ? (
                  <EnumPill color="green" icon={CheckCircle2} className="shrink-0">
                    {t.profile.verified}
                  </EnumPill>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendVerification}
                    disabled={isSendingVerif}
                    className="gap-2 shrink-0"
                  >
                    {isSendingVerif ? (
                      <>
                        <Spinner className="size-3" />
                        {t.profile.verifyEmailSending}
                      </>
                    ) : (
                      t.profile.verifyEmail
                    )}
                  </Button>
                )}
              </div>
            )}
          </PageSection>
        )}

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
