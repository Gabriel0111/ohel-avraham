"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Home,
  User,
  Users,
  Search,
  MapPin,
  Phone,
  Accessibility,
  Calendar,
} from "lucide-react";
import { useState, useMemo } from "react";

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PeoplePage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const allHosts = useQuery(api.hosts.getAllHosts);
  const allGuests = useQuery(api.guests.getAllGuests);

  const [hostSearch, setHostSearch] = useState("");
  const [guestSearch, setGuestSearch] = useState("");

  const isAdmin = currentUser?.role === "admin";
  const isHost =
    currentUser?.role === "host" || currentUser?.role === "guest:host";
  const isGuest =
    currentUser?.role === "guest" || currentUser?.role === "guest:host";

  const filteredHosts = useMemo(() => {
    if (!allHosts) return [];
    return allHosts.filter((host) => {
      const search = hostSearch.toLowerCase();
      if (!search) return true;
      return (
        host.name?.toLowerCase().includes(search) ||
        host.address?.toLowerCase().includes(search) ||
        host.sector?.toLowerCase().includes(search) ||
        host.kashrout?.toLowerCase().includes(search)
      );
    });
  }, [allHosts, hostSearch]);

  const filteredGuests = useMemo(() => {
    if (!allGuests) return [];
    return allGuests.filter((guest) => {
      const search = guestSearch.toLowerCase();
      if (!search) return true;
      return (
        guest.name?.toLowerCase().includes(search) ||
        guest.region?.toLowerCase().includes(search) ||
        guest.sector?.toLowerCase().includes(search)
      );
    });
  }, [allGuests, guestSearch]);

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
        Please log in to view people.
      </div>
    );
  }

  // Role-based: guests see hosts, hosts see guests, admins see both
  const showHosts = isGuest || isAdmin;
  const showGuests = isHost || isAdmin;
  const defaultTab = isAdmin ? "hosts" : isGuest ? "hosts" : "guests";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          People
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Manage all hosts and guests on the platform."
            : isHost
              ? "Browse guests looking for a Shabbat meal."
              : "Find hosts offering Shabbat meals near you."}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showHosts && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Hosts
              </CardTitle>
              <Home className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {allHosts?.length ?? 0}
              </p>
            </CardContent>
          </Card>
        )}
        {showGuests && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Guests
              </CardTitle>
              <User className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {allGuests?.length ?? 0}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs for hosts / guests */}
      <Tabs defaultValue={defaultTab}>
        {isAdmin && (
          <TabsList>
            <TabsTrigger value="hosts" className="gap-1.5">
              <Home className="size-3.5" />
              Hosts
            </TabsTrigger>
            <TabsTrigger value="guests" className="gap-1.5">
              <Users className="size-3.5" />
              Guests
            </TabsTrigger>
          </TabsList>
        )}

        {/* Hosts Table */}
        {showHosts && (
          <TabsContent value="hosts">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-foreground">Hosts</CardTitle>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search hosts..."
                      value={hostSearch}
                      onChange={(e) => setHostSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {allHosts === undefined ? (
                  <div className="flex justify-center py-10">
                    <Spinner className="size-6" />
                  </div>
                ) : filteredHosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                    <Home className="size-8" />
                    <p>No hosts found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Host</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Address
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Sector
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Kashrout
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Ethnicity
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Access
                        </TableHead>
                        {isAdmin && (
                          <TableHead className="hidden lg:table-cell">
                            Phone
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHosts.map((host) => (
                        <TableRow key={host._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9">
                                <AvatarImage src={host.image} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {getInitials(host.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">
                                  {host.name || "Unknown"}
                                </span>
                                <span className="text-xs text-muted-foreground md:hidden">
                                  {host.address}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="size-3.5 shrink-0" />
                              <span className="truncate max-w-[200px]">
                                {host.address}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="secondary">{host.sector}</Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline">{host.kashrout}</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {host.ethnicity}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {host.hasDisabilityAccess ? (
                              <Accessibility className="size-4 text-green-600" />
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                --
                              </span>
                            )}
                          </TableCell>
                          {isAdmin && (
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Phone className="size-3.5" />
                                <span className="text-xs">
                                  {host.phoneNumber}
                                </span>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Guests Table */}
        {showGuests && (
          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-foreground">Guests</CardTitle>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search guests..."
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {allGuests === undefined ? (
                  <div className="flex justify-center py-10">
                    <Spinner className="size-6" />
                  </div>
                ) : filteredGuests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                    <Users className="size-8" />
                    <p>No guests found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Region
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Sector
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Ethnicity
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Gender
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Date of Birth
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuests.map((guest) => (
                        <TableRow key={guest._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9">
                                <AvatarImage src={guest.image} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {getInitials(guest.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">
                                  {guest.name || "Unknown"}
                                </span>
                                <span className="text-xs text-muted-foreground sm:hidden">
                                  {guest.region}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="size-3.5 shrink-0" />
                              <span>{guest.region}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="secondary">{guest.sector}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {guest.ethnicity}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {guest.gender}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="size-3.5" />
                              <span className="text-xs">
                                {formatDate(guest.dob)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
