"use client";

import { useAuth } from "@/app/ConvexClientProvider";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";
import { isDeletingAccount } from "@/lib/account-deletion";
import { isJustRegistered } from "@/lib/registration-success";
import { useT } from "@/lib/i18n/context";
import { useMutation, useConvexAuth } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const AUTH_PAGES = ["/login", "/sign-up"];
const COMPLETE_REGISTRATION = "/complete-registration";
const PROTECTED_PREFIX = "/dashboard";

export function AuthSync() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isLoading: isConvexLoading, isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const createUser = useMutation(api.users.createUser);
  const isCreating = useRef(false);
  const { lang, setLang } = useT();
  const setLanguage = useMutation(api.users.setLanguage);
  const langReconciled = useRef(false);
  const syncOAuthAvatar = useMutation(api.users.syncOAuthAvatar);
  const avatarReconciled = useRef(false);

  useEffect(() => {
    if (isLoading || isConvexLoading) return;

    // Google OAuth: session exists but no Convex user record yet → create it
    // Only attempt when Convex is fully authenticated to avoid spurious calls
    // during JWT refresh (e.g. triggered by another user's session being deleted).
    // Don't resurrect an account that's mid-deletion: during deletion the
    // `users` row is gone but the session lingers briefly, which would
    // otherwise look like a fresh OAuth user needing creation.
    if (
      session?.user?.id &&
      !isAuthenticated &&
      isConvexAuthenticated &&
      !isCreating.current &&
      !isDeletingAccount()
    ) {
      isCreating.current = true;
      // Whatever language the sign-up/login screen is currently in becomes
      // the account's stored preference (also covers Google's implicit
      // sign-up, which never sees the email/password form).
      createUser({ language: lang })
        .catch(() => {
          // Swallow transient auth races (e.g. JWT refresh); the effect
          // re-runs once Convex auth settles and will retry.
        })
        .finally(() => {
          isCreating.current = false;
        });
      return;
    }

    if (!isAuthenticated || AUTH_PAGES.includes(pathname)) return;

    // Incomplete users (role "user") may browse public pages freely, but the
    // protected dashboard still requires a finalized profile, so bounce them to
    // the registration form there. Completed users never sit on that form.
    if (user?.role === "user" && pathname.startsWith(PROTECTED_PREFIX)) {
      router.replace(COMPLETE_REGISTRATION);
    } else if (
      user?.role !== "user" &&
      pathname === COMPLETE_REGISTRATION &&
      !isJustRegistered()
    ) {
      // Skip the bounce while the post-registration success screen is playing;
      // it navigates to /dashboard itself once the user is done.
      router.replace("/");
    }
  }, [session?.user?.id, isAuthenticated, isLoading, isConvexLoading, isConvexAuthenticated, user?.role, pathname, lang]);

  // Once per page load, ask the server to re-check the OAuth provider photo and
  // re-copy it into Convex storage if the user changed it. No-op for custom
  // uploads and when nothing changed — see api.users.syncOAuthAvatar.
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    if (avatarReconciled.current) return;
    avatarReconciled.current = true;
    syncOAuthAvatar().catch(() => {
      // Best-effort; retried on the next page load.
    });
  }, [isLoading, isAuthenticated, user]);

  // Language preference follows the account across devices. On the first
  // resolved auth state per page load, a stored preference that differs from
  // the current cookie/localStorage value wins (e.g. logging in on a new
  // device) — adopted once via `setLang`, never overwritten again this
  // session. From then on, any local change (the account had none yet, or
  // the user just switched it in the nav) is pushed back up to Convex.
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    if (!langReconciled.current) {
      langReconciled.current = true;
      if (user.language && user.language !== lang) {
        setLang(user.language);
        return;
      }
    }

    if (user.language !== lang) {
      setLanguage({ language: lang }).catch(() => {
        // Best-effort: worst case the preference just doesn't follow this
        // account to another device yet; local cookie/localStorage still work.
      });
    }
  }, [isLoading, isAuthenticated, user?.language, lang]);

  return null;
}
