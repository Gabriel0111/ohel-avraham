import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/context";

interface VerificationStatusProps {
  isVerified: boolean;
  isAdmin?: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
}

export const VerificationStatus = ({
  isVerified,
  isAdmin,
  verifiedBy,
  verifiedAt,
}: VerificationStatusProps) => {
  const { t, lang } = useT();

  const effectivelyVerified = isVerified || isAdmin;

  const verifiedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString(
        lang === "he" ? "he-IL" : lang === "fr" ? "fr-FR" : "en-GB",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : null;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        effectivelyVerified
          ? "border-green-500/20 bg-green-500/5"
          : "border-amber-500/20 bg-amber-500/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${
            effectivelyVerified
              ? "bg-green-500/15 text-green-600"
              : "bg-amber-500/15 text-amber-600"
          }`}
        >
          {effectivelyVerified ? (
            <ShieldCheck className="size-4" />
          ) : (
            <Clock className="size-4" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">
            {effectivelyVerified
              ? t.profile.verifiedAccount
              : t.profile.identityPending}
          </p>
          {effectivelyVerified && verifiedBy && verifiedDate ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="size-3 text-green-500 shrink-0" />
              {t.profile.verifiedByLabel}{" "}
              <span className="font-medium text-foreground">{verifiedBy}</span>
              {" · "}
              {verifiedDate}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {effectivelyVerified ? t.profile.verifiedAccount : t.profile.manualReview}
            </p>
          )}
        </div>
      </div>
      {!effectivelyVerified && (
        <Badge
          variant="outline"
          className="text-amber-600 border-amber-500/30 shrink-0 text-xs"
        >
          {t.profile.actionRequired}
        </Badge>
      )}
    </div>
  );
};
