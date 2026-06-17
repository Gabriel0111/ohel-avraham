"use client";

import { useEffect, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { EnumPill } from "@/components/ui/enum-pill";
import GoogleIcon from "@/components/icons/google";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
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

  const refreshAccounts = async () => {
    const res = await authClient.listAccounts();
    const list = (res.data as Account[]) ?? [];
    setAccounts(list);
    return list;
  };

  const handleLinkGoogle = () => {
    startTransition(async () => {
      // `disableRedirect` returns the consent URL instead of navigating the
      // current tab, so we can open it in a popup window.
      const { data, error } = await authClient.linkSocial({
        provider: "google",
        callbackURL: "/dashboard/profile",
        disableRedirect: true,
      });

      if (error || !data?.url) {
        toast.error(t.profile.linkGoogleError);
        return;
      }

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        data.url,
        "link-google",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      if (!popup) {
        toast.error(t.profile.linkGoogleError);
        return;
      }

      // Wait until the popup returns to our origin (link done) or is closed.
      await new Promise<void>((resolve) => {
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer);
            resolve();
            return;
          }
          try {
            if (popup.location.origin === window.location.origin) {
              clearInterval(timer);
              popup.close();
              resolve();
            }
          } catch {
            // Still on Google's origin — cross-origin read throws; keep waiting.
          }
        }, 500);
      });

      const list = await refreshAccounts();
      if (list.some((a) => a.providerId === "google")) {
        toast.success(t.profile.linkGoogleSuccess);
      } else {
        toast.error(t.profile.linkGoogleError);
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Google */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-muted">
            <GoogleIcon className="size-4" />
          </div>
          <p className="text-sm font-medium">{t.profile.googleAccount}</p>
        </div>
        {isLoading ? (
          <Skeleton className="h-7 w-20 rounded-full" />
        ) : isGoogleLinked ? (
          <EnumPill color="green" icon={CheckCircle2}>
            {t.profile.linked}
          </EnumPill>
        ) : (
          <Button size="sm" variant="outline" onClick={handleLinkGoogle} disabled={isPending} className="gap-2">
            {isPending ? (
              <><Spinner className="size-3" />{t.profile.linkingGoogle}</>
            ) : (
              <>{t.profile.linkGoogle}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
