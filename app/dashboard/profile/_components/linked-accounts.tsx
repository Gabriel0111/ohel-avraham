"use client";

import { useEffect, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GoogleIcon from "@/components/icons/google";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/lib/i18n/context";

type Account = {
  id: string;
  providerId: string;
  accountId: string;
};

export function LinkedAccounts() {
  const { t } = useT();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    authClient.listAccounts().then((res) => {
      if (res.data) setAccounts(res.data as Account[]);
      setIsLoading(false);
    });
  }, []);

  const isGoogleLinked = accounts.some((a) => a.providerId === "google");

  const handleLinkGoogle = () => {
    startTransition(async () => {
      const { error } = await authClient.linkSocial({
        provider: "google",
        callbackURL: "/dashboard/profile",
      });
      if (error) {
        toast.error(t.profile.linkGoogleError);
      }
    });
  };

  if (isLoading) return null;

  return (
    <div className="space-y-3">
      {/* Google */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-muted">
            <GoogleIcon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{t.profile.googleAccount}</p>
          </div>
        </div>
        {isGoogleLinked ? (
          <Badge
            variant="outline"
            className="gap-1.5 text-green-600 border-green-500/30"
          >
            <CheckCircle2 className="size-3" />
            {t.profile.linked}
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleLinkGoogle}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Spinner className="size-3" />
                {t.profile.linkingGoogle}
              </>
            ) : (
              <>{t.profile.linkGoogle}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
