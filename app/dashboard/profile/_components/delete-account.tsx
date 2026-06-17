"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
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
      // 1. Delete app data (users, hosts, guests) while still authenticated
      await deleteUser();

      // 2. Delete Better Auth data (sessions, accounts) + sign out
      const { error } = await authClient.deleteUser();
      if (error) {
        toast.error(t.profile.deleteAccountError);
        return;
      }

      router.push("/");
    });
  };

  return (
    <AlertDialog>
      <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-destructive/10 text-destructive">
            <Trash2 className="size-5" />
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
