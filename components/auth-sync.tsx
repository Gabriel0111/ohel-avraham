"use client";

import { useAuth } from "@/app/ConvexClientProvider";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";
import { isDeletingAccount } from "@/lib/account-deletion";
import { isJustRegistered } from "@/lib/registration-success";
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
      createUser()
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
  }, [session?.user?.id, isAuthenticated, isLoading, isConvexLoading, isConvexAuthenticated, user?.role, pathname]);

  return null;
}
