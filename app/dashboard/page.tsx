"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import {
  User,
  Users,
  Home,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "admin":
      return "destructive" as const;
    case "rabbi":
      return "default" as const;
    case "host":
    case "guest":
    case "guest:host":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function getRoleIcon(role: string) {
  switch (role) {
    case "admin":
      return <Shield className="size-4" />;
    case "host":
    case "guest:host":
      return <Home className="size-4" />;
    case "guest":
      return <User className="size-4" />;
    default:
      return <User className="size-4" />;
  }
}

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const myHost = useQuery(api.hosts.getMyHost);
  const myGuest = useQuery(api.guests.getMyGuest);

  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center flex-1 py-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center flex-1 py-20 text-muted-foreground">
        Please log in to view your dashboard.
      </div>
    );
  }

  const role = currentUser.role;
  const isHost = role === "host" || role === "guest:host";
  const isGuest = role === "guest" || role === "guest:host";
  const isAdmin = role === "admin";
  const hasProfile = isHost ? !!myHost : isGuest ? !!myGuest : true;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Welcome header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {currentUser.name || "User"}
          </h1>
          <Badge variant={getRoleBadgeVariant(role)}>
            {getRoleIcon(role)}
            {role}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {currentUser.email || "Manage your Ohel Avraham account"}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profile Status
            </CardTitle>
            {hasProfile ? (
              <CheckCircle2 className="size-4 text-green-600" />
            ) : (
              <AlertCircle className="size-4 text-amber-500" />
            )}
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {hasProfile ? "Complete" : "Incomplete"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {hasProfile
                ? "Your profile is set up"
                : "Finish setting up your profile"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Role
            </CardTitle>
            {getRoleIcon(role)}
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground capitalize">
              {role}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isHost && "You can host Shabbat meals"}
              {isGuest && !isHost && "You can join Shabbat meals"}
              {isAdmin && "Full platform management access"}
              {role === "rabbi" && "Community oversight access"}
              {role === "user" && "Complete registration to get started"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verification
            </CardTitle>
            {currentUser.isVerified ? (
              <CheckCircle2 className="size-4 text-green-600" />
            ) : (
              <AlertCircle className="size-4 text-amber-500" />
            )}
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {currentUser.isVerified ? "Verified" : "Pending"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {currentUser.isVerified
                ? "Account verified"
                : "Awaiting verification"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:border-primary/30 transition-colors">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Edit Profile</p>
                <p className="text-sm text-muted-foreground">
                  Update your personal information
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/profile">
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-colors">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Browse People</p>
                <p className="text-sm text-muted-foreground">
                  {isAdmin
                    ? "Manage all hosts and guests"
                    : isHost
                      ? "See guests looking for meals"
                      : "Find hosts near you"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/people">
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
