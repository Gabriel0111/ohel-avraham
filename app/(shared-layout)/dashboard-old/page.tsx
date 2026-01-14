"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdminTable from "@/app/(shared-layout)/dashboard-old/_components/admin-table";
import { useAuth } from "@/app/ConvexClientProvider";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const allUsers = useQuery(api.hosts.getAllHosts);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        Loading...
      </div>
    );
  }

  if (!allUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        Loading users...
      </div>
    );
  }

  return <AdminTable data={allUsers} />;
};

export default DashboardPage;
