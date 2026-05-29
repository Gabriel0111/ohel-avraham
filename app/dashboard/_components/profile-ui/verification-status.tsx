import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/context";

interface VerificationStatusProps {
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
}

export const VerificationStatus = ({
  isVerified,
  verifiedBy,
  verifiedAt,
}: VerificationStatusProps) => {
  const { t, lang } = useT();

  const verifiedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString(
        lang === "he" ? "he-IL" : lang === "fr" ? "fr-FR" : "en-GB",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : null;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        isVerified
          ? "border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent"
          : "border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${
            isVerified
              ? "bg-green-500/15 text-green-600"
              : "bg-amber-500/15 text-amber-600"
          }`}
        >
          {isVerified ? (
            <ShieldCheck className="size-4" />
          ) : (
            <Clock className="size-4" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">
            {isVerified
              ? t.profile.verifiedAccount
              : t.profile.identityPending}
          </p>
          {isVerified && verifiedBy && verifiedDate ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="size-3 text-green-500 shrink-0" />
              {t.profile.verifiedByLabel}{" "}
              <span className="font-medium text-foreground">{verifiedBy}</span>
              {" · "}
              {verifiedDate}
            </p>
          ) : !isVerified ? (
            <p className="text-xs text-muted-foreground">
              {t.profile.manualReview}
            </p>
          ) : null}
        </div>
      </div>
      {!isVerified && (
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
