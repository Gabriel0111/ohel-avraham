"use client";

import { useAuth } from "@/app/ConvexClientProvider";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const AUTH_PAGES = ["/login", "/sign-up"];
const COMPLETE_REGISTRATION = "/complete-registration";

export function AuthSync() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { user, isAuthenticated, isLoading } = useAuth();
  const createUser = useMutation(api.users.createUser);
  const isCreating = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    // Google OAuth: session exists but no Convex user record yet → create it
    if (session?.user?.id && !isAuthenticated && !isCreating.current) {
      isCreating.current = true;
      createUser().finally(() => {
        isCreating.current = false;
      });
      return;
    }

    if (!isAuthenticated || AUTH_PAGES.includes(pathname)) return;

    if (user?.role === "user" && pathname !== COMPLETE_REGISTRATION) {
      router.replace(COMPLETE_REGISTRATION);
    } else if (user?.role !== "user" && pathname === COMPLETE_REGISTRATION) {
      router.replace("/");
    }
  }, [session?.user?.id, isAuthenticated, isLoading, user?.role, pathname]);

  return null;
}
