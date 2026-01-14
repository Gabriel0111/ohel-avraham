"use client";
import { redirect } from "next/navigation";
import { useAuth } from "@/app/ConvexClientProvider";
import { Doc } from "@/convex/_generated/dataModel";

export async function requireUser(): Promise<Doc<"users">> {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  if (user?.role !== "user") {
    return redirect("/");
  }

  return user;
}
