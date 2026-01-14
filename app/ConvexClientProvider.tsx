"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { ConvexReactClient, useQuery } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { env } from "@/lib/env";

type AuthContextType = {
  user: Doc<"users"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isLoading: user === undefined,
      isAuthenticated: user !== null && user !== undefined,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL, {
  expectAuth: true,
});

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
      initialToken={initialToken}
    >
      <AuthProvider>{children}</AuthProvider>
    </ConvexBetterAuthProvider>
  );
}
