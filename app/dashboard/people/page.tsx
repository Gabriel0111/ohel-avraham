"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Building2,
  Utensils,
  StickyNote,
} from "lucide-react";
import { useState, useMemo, useEffect, type ReactNode } from "react";
import { useT } from "@/lib/i18n/context";
import { toast } from "sonner";
import { type Id } from "@/convex/_generated/dataModel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { useRouter } from "next/navigation";

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

type HostData = NonNullable<
  ReturnType<typeof useQuery<typeof api.hosts.getAllHosts>>
>[number];
type GuestData = NonNullable<
  ReturnType<typeof useQuery<typeof api.guests.getAllGuests>>
>[number];

// ─── Shared info block ────────────────────────────────────────────────────────

function InfoBlock({
  icon,
  label,
  children,
  accent = "bg-primary/10 text-primary",
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
      <div
        className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
          {label}
        </p>
        <div className="text-sm font-medium text-foreground">{children}</div>
      </div>
    </div>
  );
}

// ─── Host Detail Dialog ───────────────────────────────────────────────────────

function HostDetailDialog({
  host,
  isAdmin,
  verifying,
  onConfirm,
  onClose,
}: {
  host: HostData | null;
  isAdmin: boolean;
  verifying: string | null;
  onConfirm: (userId: Id<"users">) => void;
  onClose: () => void;
}) {
  const { t } = useT();
  if (!host) return null;
  const isVerified = host.isVerified;

  return (
    <Dialog open={!!host} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Avatar className="size-16 border-2 border-primary/20 shadow-lg">
                <AvatarImage src={host.image} />
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {getInitials(host.name)}
                </AvatarFallback>
              </Avatar>
              {isVerified && (
                <span className="absolute -bottom-1 -right-1 size-5 flex items-center justify-center rounded-full bg-green-500 ring-2 ring-background shadow-sm">
                  <CheckCircle2 className="size-3 text-white" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-lg font-bold leading-tight">
                  {host.name || t.people.unknown}
                </DialogTitle>
                {host.role && <RoleBadge role={host.role} />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {host.email}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Body */}
        <div className="px-5 py-4 space-y-2.5 max-h-[55vh] overflow-y-auto">
          {/* Address */}
          <InfoBlock
            icon={<MapPin className="size-4" />}
            label={t.form.address}
          >
            <span className="leading-snug">{host.address}</span>
            {host.floor && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                · {t.form.floor} {host.floor}
              </span>
            )}
          </InfoBlock>

          {/* Phone */}
          <InfoBlock
            icon={<Phone className="size-4" />}
            label={t.form.phoneNumber}
            accent="bg-blue-500/10 text-blue-600"
          >
            <a
              href={`tel:${host.phoneNumber}`}
              className="hover:text-primary transition-colors"
            >
              {host.phoneNumber}
            </a>
          </InfoBlock>

          {/* Community: 3-col grid */}
          <div className="grid grid-cols-3 gap-2">
            <InfoBlock
              icon={<Building2 className="size-4" />}
              label={t.form.sector}
              accent="bg-violet-500/10 text-violet-600"
            >
              {host.sector}
            </InfoBlock>
            <InfoBlock
              icon={<Utensils className="size-4" />}
              label={t.form.kashrout}
              accent="bg-amber-500/10 text-amber-600"
            >
              {host.kashrout}
            </InfoBlock>
            <InfoBlock
              icon={<Users className="size-4" />}
              label={t.form.ethnicity}
              accent="bg-rose-500/10 text-rose-600"
            >
              {host.ethnicity}
            </InfoBlock>
          </div>

          {/* DOB + Accessibility */}
          <div className="grid grid-cols-2 gap-2">
            <InfoBlock
              icon={<Calendar className="size-4" />}
              label={t.form.dateOfBirth}
              accent="bg-sky-500/10 text-sky-600"
            >
              {formatDate(host.dob)}
            </InfoBlock>
            <InfoBlock
              icon={<Accessibility className="size-4" />}
              label={t.form.disabilityAccess}
              accent={
                host.hasDisabilityAccess
                  ? "bg-green-500/10 text-green-600"
                  : "bg-muted text-muted-foreground"
              }
            >
              <span
                className={
                  host.hasDisabilityAccess
                    ? "text-green-700 dark:text-green-400"
                    : "text-muted-foreground font-normal"
                }
              >
                {host.hasDisabilityAccess
                  ? t.hostProfile.stepFreeAccess
                  : t.hostProfile.noSpecializedAccess}
              </span>
            </InfoBlock>
          </div>

          {/* Notes */}
          {host.notes && (
            <InfoBlock
              icon={<StickyNote className="size-4" />}
              label={t.form.notes}
              accent="bg-orange-500/10 text-orange-600"
            >
              <p className="font-normal text-foreground/80 leading-relaxed">
                {host.notes}
              </p>
            </InfoBlock>
          )}
        </div>

        {/* Footer */}
        {isAdmin && (
          <>
            <Separator />
            <DialogFooter className="px-5 py-4 flex flex-row items-center justify-between gap-3">
              {isVerified ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-semibold">
                  <CheckCircle2 className="size-3.5" />
                  {t.people.confirmed}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium">
                  <ShieldAlert className="size-3.5" />
                  {t.people.unverified}
                </div>
              )}
              {!isVerified && (
                <Button
                  onClick={() => onConfirm(host.userId as Id<"users">)}
                  disabled={verifying === host.userId}
                  className="gap-2"
                >
                  {verifying === host.userId ? (
                    <Spinner className="size-4" />
                  ) : (
                    <ShieldCheck className="size-4" />
                  )}
                  {t.people.confirm}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Guest Detail Dialog ──────────────────────────────────────────────────────

function GuestDetailDialog({
  guest,
  onClose,
}: {
  guest: GuestData | null;
  onClose: () => void;
}) {
  const { t } = useT();
  if (!guest) return null;

  return (
    <Dialog open={!!guest} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500/60 via-emerald-500 to-emerald-500/60" />

        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border-2 border-emerald-500/20 shadow-lg shrink-0">
              <AvatarImage src={guest.image} />
              <AvatarFallback className="text-xl font-bold bg-emerald-500/10 text-emerald-600">
                {getInitials(guest.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold leading-tight">
                {guest.name || t.people.unknown}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {guest.email}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="px-5 py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {/* Region */}
          <InfoBlock
            icon={<MapPin className="size-4" />}
            label={t.form.region}
            accent="bg-emerald-500/10 text-emerald-600"
          >
            {guest.region}
          </InfoBlock>

          {/* Community: 3-col grid */}
          <div className="grid grid-cols-3 gap-2">
            <InfoBlock
              icon={<Building2 className="size-4" />}
              label={t.form.sector}
              accent="bg-violet-500/10 text-violet-600"
            >
              {guest.sector}
            </InfoBlock>
            <InfoBlock
              icon={<User className="size-4" />}
              label={t.form.gender}
              accent="bg-sky-500/10 text-sky-600"
            >
              {guest.gender}
            </InfoBlock>
            <InfoBlock
              icon={<Users className="size-4" />}
              label={t.form.ethnicity}
              accent="bg-rose-500/10 text-rose-600"
            >
              {guest.ethnicity}
            </InfoBlock>
          </div>

          {/* DOB */}
          <InfoBlock
            icon={<Calendar className="size-4" />}
            label={t.form.dateOfBirth}
            accent="bg-amber-500/10 text-amber-600"
          >
            {formatDate(guest.dob)}
          </InfoBlock>

          {/* Notes */}
          {guest.notes && (
            <InfoBlock
              icon={<StickyNote className="size-4" />}
              label={t.form.notes}
              accent="bg-orange-500/10 text-orange-600"
            >
              <p className="font-normal text-foreground/80 leading-relaxed">
                {guest.notes}
              </p>
            </InfoBlock>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PeoplePage() {
  const { t } = useT();
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const allHosts = useQuery(api.hosts.getAllHosts);
  const allGuests = useQuery(api.guests.getAllGuests);
  const verifyUser = useMutation(api.users.verifyUser);

  const [hostSearch, setHostSearch] = useState("");
  const [guestSearch, setGuestSearch] = useState("");
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedHost, setSelectedHost] = useState<HostData | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);

  const isAdmin = currentUser?.role === "admin";

  const filteredHosts = useMemo(() => {
    if (!allHosts) return [];
    return allHosts.filter((host) => {
      const search = hostSearch.toLowerCase();
      const matchesSearch =
        !search ||
        host.name?.toLowerCase().includes(search) ||
        host.address?.toLowerCase().includes(search) ||
        host.sector?.toLowerCase().includes(search) ||
        host.kashrout?.toLowerCase().includes(search);
      const matchesVerified = !showUnverifiedOnly || !host.isVerified;
      return matchesSearch && matchesVerified;
    });
  }, [allHosts, hostSearch, showUnverifiedOnly]);

  const filteredGuests = useMemo(() => {
    if (!allGuests) return [];
    return allGuests.filter((guest) => {
      const search = guestSearch.toLowerCase();
      return (
        !search ||
        guest.name?.toLowerCase().includes(search) ||
        guest.region?.toLowerCase().includes(search) ||
        guest.sector?.toLowerCase().includes(search)
      );
    });
  }, [allGuests, guestSearch]);

  const handleVerify = async (userId: Id<"users">) => {
    setVerifying(userId);
    try {
      await verifyUser({ userId });
      toast.success(t.people.confirmSuccess);
      setSelectedHost(null);
    } catch {
      toast.error(t.people.confirmError);
    } finally {
      setVerifying(null);
    }
  };

  useEffect(() => {
    if (currentUser !== undefined && currentUser?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center flex-1 py-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-20 gap-4 text-center">
        <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="size-6 text-destructive" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Accès refusé</p>
          <p className="text-sm text-muted-foreground">
            Cette page est réservée aux administrateurs.
          </p>
        </div>
      </div>
    );
  }

  const showHosts = true;
  const showGuests = true;
  const defaultTab = "hosts";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t.people.title}
        </h1>
        <p className="text-muted-foreground">{t.people.adminDesc}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showHosts && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.people.totalHosts}
              </CardTitle>
              <Home className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {allHosts?.length ?? 0}
              </p>
              {isAdmin && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                  {allHosts?.filter((h) => !h.isVerified).length ?? 0}{" "}
                  {t.people.unverified.toLowerCase()}
                </p>
              )}
            </CardContent>
          </Card>
        )}
        {showGuests && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.people.totalGuests}
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

      {/* Admin filter (hosts only) */}
      {isAdmin && (
        <div className="flex items-center gap-2">
          <Switch
            id="unverified-filter"
            checked={showUnverifiedOnly}
            onCheckedChange={setShowUnverifiedOnly}
          />
          <Label htmlFor="unverified-filter" className="text-sm cursor-pointer">
            {t.people.showUnverifiedOnly}
          </Label>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue={defaultTab}>
        {isAdmin && (
          <TabsList>
            <TabsTrigger value="hosts" className="gap-1.5">
              <Home className="size-3.5" />
              {t.people.hosts}
            </TabsTrigger>
            <TabsTrigger value="guests" className="gap-1.5">
              <Users className="size-3.5" />
              {t.people.guests}
            </TabsTrigger>
          </TabsList>
        )}

        {/* Hosts Table */}
        {showHosts && (
          <TabsContent value="hosts">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-foreground">
                    {t.people.hosts}
                  </CardTitle>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder={t.people.searchHosts}
                      value={hostSearch}
                      onChange={(e) => setHostSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {allHosts === undefined ? (
                  <div className="flex justify-center py-10">
                    <Spinner className="size-6" />
                  </div>
                ) : filteredHosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                    <Home className="size-8" />
                    <p>{t.people.noHostsFound}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border/60">
                        <TableHead className="pl-6">{t.people.host}</TableHead>
                        <TableHead className="hidden md:table-cell">
                          {t.form.address}
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          {t.form.sector}
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          {t.form.kashrout}
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          {t.form.ethnicity}
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          {t.people.access}
                        </TableHead>
                        {isAdmin && (
                          <TableHead className="pr-6">
                            {t.people.status}
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHosts.map((host) => (
                        <TableRow
                          key={host._id}
                          onClick={() => setSelectedHost(host)}
                          className="cursor-pointer transition-colors hover:bg-accent/60 active:bg-accent border-b border-border/40 last:border-0"
                        >
                          <TableCell className="pl-6 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9 border border-border/50 shrink-0">
                                <AvatarImage src={host.image} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                                  {getInitials(host.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground text-sm">
                                  {host.name || t.people.unknown}
                                </span>
                                <span className="text-xs text-muted-foreground md:hidden">
                                  {host.address}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-3">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="size-3.5 shrink-0" />
                              <span className="text-sm truncate max-w-[200px]">
                                {host.address}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-3">
                            <Badge variant="secondary" className="text-xs">
                              {host.sector}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-3">
                            <Badge variant="outline" className="text-xs">
                              {host.kashrout}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell py-3 text-sm text-muted-foreground">
                            {host.ethnicity}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell py-3">
                            {host.hasDisabilityAccess ? (
                              <Accessibility className="size-4 text-green-600" />
                            ) : (
                              <span className="text-xs text-muted-foreground/50">
                                —
                              </span>
                            )}
                          </TableCell>
                          {isAdmin && (
                            <TableCell className="pr-6 py-3">
                              {host.isVerified ? (
                                <div className="flex items-center gap-1.5 text-green-600">
                                  <CheckCircle2 className="size-4" />
                                  <span className="text-xs hidden sm:inline font-medium">
                                    {t.people.confirmed}
                                  </span>
                                </div>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-amber-500/40 text-amber-600 bg-amber-50 dark:bg-amber-950/20 gap-1"
                                >
                                  <ShieldCheck className="size-2.5" />
                                  {t.people.unverified}
                                </Badge>
                              )}
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
                  <CardTitle className="text-foreground">
                    {t.people.guests}
                  </CardTitle>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder={t.people.searchGuests}
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {allGuests === undefined ? (
                  <div className="flex justify-center py-10">
                    <Spinner className="size-6" />
                  </div>
                ) : filteredGuests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                    <Users className="size-8" />
                    <p>{t.people.noGuestsFound}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border/60">
                        <TableHead className="pl-6">{t.people.guest}</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          {t.form.region}
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          {t.form.sector}
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          {t.form.ethnicity}
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          {t.form.gender}
                        </TableHead>
                        <TableHead className="hidden lg:table-cell pr-6">
                          {t.form.dateOfBirth}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuests.map((guest) => (
                        <TableRow
                          key={guest._id}
                          onClick={() => setSelectedGuest(guest)}
                          className="cursor-pointer transition-colors hover:bg-accent/60 active:bg-accent border-b border-border/40 last:border-0"
                        >
                          <TableCell className="pl-6 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9 border border-border/50 shrink-0">
                                <AvatarImage src={guest.image} />
                                <AvatarFallback className="text-xs bg-emerald-500/10 text-emerald-600 font-semibold">
                                  {getInitials(guest.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground text-sm">
                                  {guest.name || t.people.unknown}
                                </span>
                                <span className="text-xs text-muted-foreground sm:hidden">
                                  {guest.region}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-3">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="size-3.5 shrink-0" />
                              <span className="text-sm">{guest.region}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-3">
                            <Badge variant="secondary" className="text-xs">
                              {guest.sector}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-3 text-sm text-muted-foreground">
                            {guest.ethnicity}
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-3 text-sm text-muted-foreground">
                            {guest.gender}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell py-3 pr-6">
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

      {/* Dialogs */}
      <HostDetailDialog
        host={selectedHost}
        isAdmin={isAdmin}
        verifying={verifying}
        onConfirm={handleVerify}
        onClose={() => setSelectedHost(null)}
      />
      <GuestDetailDialog
        guest={selectedGuest}
        onClose={() => setSelectedGuest(null)}
      />
    </div>
  );
}
