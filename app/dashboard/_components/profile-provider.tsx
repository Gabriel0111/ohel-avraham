"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

type FullProfile = FunctionReturnType<typeof api.users.getFullProfile>;

const ProfileContext = createContext<{ data: FullProfile | undefined } | null>(
  null,
);

/**
 * Subscribes to the current user's full profile once, at the dashboard layout
 * level. Because the App Router keeps a shared layout mounted while navigating
 * between sibling routes, the subscription survives moving between
 * /dashboard/profile and /dashboard/community-profile — so the data is served
 * from memory with no refetch flash. No localStorage: the cache is the live
 * Convex subscription held by this persistent provider.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const data = useQuery(api.users.getFullProfile);
  const value = useMemo(() => ({ data }), [data]);

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

/** Returns the cached full profile (`undefined` while loading, `null` when absent). */
export function useFullProfile(): FullProfile | undefined {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useFullProfile must be used within a ProfileProvider");
  }
  return ctx.data;
}
