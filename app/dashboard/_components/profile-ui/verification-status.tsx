import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/context";

export const VerificationStatus = ({ isVerified }: { isVerified: boolean }) => {
  const { t } = useT();
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        isVerified
          ? "border-green-500/20 bg-green-500/5"
          : "border-amber-500/20 bg-amber-500/5"
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
          <ShieldCheck className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {isVerified ? t.profile.verifiedAccount : t.profile.identityPending}
          </p>
          <p className="text-xs text-muted-foreground">{t.profile.manualReview}</p>
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
