"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser?.role === "user") router.replace("/complete-registration");
  }, [currentUser]);

  return (
    <main>
      <h1>Welcome to Ohel Abraham</h1>
    </main>
  );
}
