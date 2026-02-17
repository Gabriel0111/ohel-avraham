"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User } from "lucide-react";
import { HostProfileCard } from "./_components/host-profile-card";
import { GuestProfileCard } from "./_components/guest-profile-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
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
        Please log in to view your profile.
      </div>
    );
  }

  const role = currentUser.role;
  const isHost = role === "host" || role === "guest:host";
  const isGuest = role === "guest" || role === "guest:host";
  const isBoth = role === "guest:host";
  const isAdminOrRabbi = role === "admin" || role === "rabbi";

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage your profile information
        </p>
      </div>

      {/* User info card */}
      <Card>
        <CardContent className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            {currentUser.image ? (
              <Image
                src={currentUser.image}
                alt={currentUser.name || "User"}
                className="rounded-full"
                width={46}
                height={46}
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {(currentUser.name || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-foreground">
              {currentUser.name || "User"}
            </p>
            <Link
              href={`mailto:${currentUser.email}`}
              className="text-sm text-muted-foreground"
            >
              {currentUser.email}
            </Link>
          </div>
          <Badge variant="secondary" className="capitalize">
            {role}
          </Badge>
        </CardContent>
      </Card>

      {/* Role-based profiles */}
      {isBoth ? (
        <Tabs defaultValue="host">
          <TabsList>
            <TabsTrigger value="host" className="gap-1.5">
              <Home className="size-3.5" />
              Host Profile
            </TabsTrigger>
            <TabsTrigger value="guest" className="gap-1.5">
              <User className="size-3.5" />
              Guest Profile
            </TabsTrigger>
          </TabsList>
          <TabsContent value="host" className="mt-4">
            <HostProfileCard hostData={myHost} />
          </TabsContent>
          <TabsContent value="guest" className="mt-4">
            <GuestProfileCard guestData={myGuest} />
          </TabsContent>
        </Tabs>
      ) : isHost ? (
        <HostProfileCard hostData={myHost} />
      ) : isGuest ? (
        <GuestProfileCard guestData={myGuest} />
      ) : isAdminOrRabbi ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>
              As an {role}, you manage the platform. No host/guest profile
              needed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Complete your registration to set up your profile.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
