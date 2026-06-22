"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { setDeletingAccount } from "@/lib/account-deletion";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/context";

export function DeleteAccount() {
  const { t } = useT();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const deleteUser = useMutation(api.users.deleteUser);

  const handleDelete = () => {
    startTransition(async () => {
      // Suppress AuthSync's "create missing user" path: between deleting the
      // app data and the session being cleared, it would otherwise recreate
      // the account we're tearing down. Once app data is actually gone we must
      // NOT re-enable that path until the session is cleared — otherwise a
      // network blip leaves a resurrected, half-deleted account.
      setDeletingAccount(true);
      let appDeleted = false;
      try {
        // 1. Delete app data (users, hosts, guests, requests) while still authenticated
        await deleteUser();
        appDeleted = true;

        // 2. Delete Better Auth data (sessions, accounts) + sign out everywhere
        const { error } = await authClient.deleteUser();
        if (error) {
          // App data is gone but the auth record wasn't deleted. Sign out so the
          // lingering session can't resurrect a half-deleted account.
          await authClient.signOut().catch(() => {});
          toast.error(t.profile.deleteAccountError);
          router.push("/");
          return;
        }

        // Better Auth user + session are gone now, so the recreate race is
        // closed; clear the flag so a fresh sign-up in the same tab still works.
        setDeletingAccount(false);
        router.push("/");
      } catch {
        if (appDeleted) {
          // Destructive deletion already happened — clear the session so it
          // can't resurrect, but keep the guard set until then.
          await authClient.signOut().catch(() => {});
          router.push("/");
        } else {
          // Nothing was deleted yet: safe to re-enable normal sync.
          setDeletingAccount(false);
        }
        toast.error(t.profile.deleteAccountError);
      }
    });
  };

  return (
    <AlertDialog>
      <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-gradient-to-br from-destructive/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-destructive/15 text-destructive">
            <Trash2 className="size-4" />
          </div>
          <p className="text-sm font-medium text-destructive">
            {t.profile.deleteAccount}
          </p>
        </div>

        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="shrink-0">
            {t.profile.deleteAccount}
          </Button>
        </AlertDialogTrigger>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.profile.deleteAccount}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.profile.deleteAccountWarning}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t.profile.deleteAccountCancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 gap-2"
          >
            {isPending && <Spinner className="size-3.5" />}
            {isPending
              ? t.profile.deleteAccountDeleting
              : t.profile.deleteAccountConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
