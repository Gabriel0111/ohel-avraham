"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
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

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  // `expectAuth: true` pauses the websocket until auth is attached. That's only
  // ever resumed for authenticated users, so enabling it for a logged-out user
  // leaves every query stuck loading. Only expect auth when we actually have a
  // server token; logged-out visitors get an immediately-live socket so public
  // queries (search dialog, etc.) resolve.
  const [convex] = useState(
    () =>
      new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL, {
        expectAuth: Boolean(initialToken),
      }),
  );

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
