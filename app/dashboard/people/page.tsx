"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  StickyNote,
  Accessibility,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Ban,
  ShieldOff,
  Trash2,
} from "lucide-react";
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import * as RPNInput from "react-phone-number-input";
import { toast } from "sonner";
import { type Id } from "@/convex/_generated/dataModel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RoleBadge } from "@/app/dashboard/_components/profile-ui/role-badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { EnumPill, genderColor } from "@/components/ui/enum-pill";

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const duration = 700;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(value * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return <>{displayed}</>;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function computeAge(dobMs: number): number {
  const dob = new Date(dobMs);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

type HostData = NonNullable<
  ReturnType<typeof useQuery<typeof api.hosts.getAllHosts>>
>[number];
type GuestData = NonNullable<
  ReturnType<typeof useQuery<typeof api.guests.getAllGuests>>
>[number];

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
  const el = useEnumLabel();
  if (!host) return null;
  const isVerified = host.isVerified;

  return (
    <Dialog open={!!host} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-violet-500/8 to-transparent px-6 pt-6 pb-5 border-b border-border/50">
          <DialogHeader className="p-0">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <Avatar className="size-16 ring-2 ring-violet-500/20 shadow-md">
                  <AvatarImage src={host.image} />
                  <AvatarFallback className="bg-violet-500/10 text-violet-600 text-lg font-bold">
                    {getInitials(host.name)}
                  </AvatarFallback>
                </Avatar>
                {isVerified && (
                  <span className="absolute -bottom-1 -right-1 size-5 flex items-center justify-center rounded-full bg-green-500 ring-2 ring-background shadow-sm">
                    <CheckCircle2 className="size-3 text-white" />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <DialogTitle className="text-base font-bold leading-tight tracking-tight">
                    {host.name || t.people.unknown}
                  </DialogTitle>
                  {host.role && <RoleBadge role={host.role} />}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <EnumPill color="violet">{el.sector(host.sector)}</EnumPill>
                  <EnumPill color="blue">{el.kashrout(host.kashrout)}</EnumPill>
                  <EnumPill color="slate">
                    {el.ethnicity(host.ethnicity)}
                  </EnumPill>
                  {host.hasDisabilityAccess && (
                    <EnumPill color="green" icon={Accessibility}>
                      {t.people.access}
                    </EnumPill>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/10 to-transparent">
            <MapPin className="size-4 text-violet-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wide mb-0.5">{t.form.address}</p>
              <a
                href={mapsUrl(host.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:text-violet-600 transition-colors leading-snug underline-offset-4 hover:underline"
              >
                {host.address}
              </a>
              {(host.floor || host.entrance) && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {host.floor && `${t.form.floor} ${host.floor}`}
                  {host.floor && host.entrance && " · "}
                  {host.entrance && `${t.form.entrance} ${host.entrance}`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-blue-500/15 bg-gradient-to-br from-blue-500/10 to-transparent">
            <Phone className="size-4 text-blue-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-0.5">{t.form.phoneNumber}</p>
              <a href={`tel:${host.phoneNumber}`} className="text-sm text-foreground hover:text-blue-600 transition-colors font-medium">
                {RPNInput.formatPhoneNumberIntl(host.phoneNumber) || host.phoneNumber}
              </a>
            </div>
          </div>
          {host.email && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-rose-500/15 bg-gradient-to-br from-rose-500/10 to-transparent">
              <Mail className="size-4 text-rose-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide mb-0.5">{t.form.email}</p>
                <a href={`mailto:${host.email}`} className="text-sm text-foreground hover:text-rose-600 transition-colors font-medium break-all">
                  {host.email}
                </a>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/10 to-transparent">
            <Calendar className="size-4 text-indigo-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-0.5">{t.form.dateOfBirth}</p>
              <p className="text-sm text-foreground font-medium">
                {formatDate(host.dob)}
                <span className="text-muted-foreground font-normal"> · {computeAge(host.dob)} {t.form.yearsOld}</span>
              </p>
            </div>
          </div>
          {host.notes && (
            <div className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 to-transparent">
              <StickyNote className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1">{t.form.notes}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{host.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Admin footer */}
        {isAdmin && (
          <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between gap-3">
            {isVerified ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-gradient-to-br from-green-500/20 to-green-500/10">
                <ShieldCheck className="size-3.5 text-green-600" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {t.people.confirmed}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-500/10">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 inline-flex rounded-full bg-amber-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full size-2 bg-amber-500" />
                </span>
                <Clock className="size-3.5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  {t.people.unverified}
                </span>
              </div>
            )}
            {!isVerified && (
              <Button
                onClick={() => onConfirm(host.userId as Id<"users">)}
                disabled={verifying === host.userId}
                size="sm"
                className="gap-2 rounded-xl"
              >
                {verifying === host.userId ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <ShieldCheck className="size-3.5" />
                )}
                {t.people.confirm}
              </Button>
            )}
          </div>
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
  const el = useEnumLabel();
  if (!guest) return null;

  return (
    <Dialog open={!!guest} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-emerald-500/8 to-transparent px-6 pt-6 pb-5 border-b border-border/50">
          <DialogHeader className="p-0">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 ring-2 ring-emerald-500/20 shadow-md shrink-0">
                <AvatarImage src={guest.image} />
                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 text-lg font-bold">
                  {getInitials(guest.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <DialogTitle className="text-base font-bold leading-tight tracking-tight">
                    {guest.name || t.people.unknown}
                  </DialogTitle>
                  {guest.role && <RoleBadge role={guest.role} />}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <EnumPill color="emerald">{el.sector(guest.sector)}</EnumPill>
                  <EnumPill color="slate">
                    {el.ethnicity(guest.ethnicity)}
                  </EnumPill>
                  <EnumPill color={genderColor(guest.gender)}>
                    {el.gender(guest.gender)}
                  </EnumPill>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <MapPin className="size-4 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-0.5">{t.form.address}</p>
              <a
                href={mapsUrl(guest.region)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:text-emerald-600 transition-colors font-medium underline-offset-4 hover:underline"
              >
                {guest.region}
              </a>
            </div>
          </div>
          {guest.email && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-rose-500/15 bg-gradient-to-br from-rose-500/10 to-transparent">
              <Mail className="size-4 text-rose-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide mb-0.5">{t.form.email}</p>
                <a href={`mailto:${guest.email}`} className="text-sm text-foreground hover:text-rose-600 transition-colors font-medium break-all">
                  {guest.email}
                </a>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/10 to-transparent">
            <Calendar className="size-4 text-indigo-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-0.5">{t.form.dateOfBirth}</p>
              <p className="text-sm text-foreground font-medium">
                {formatDate(guest.dob)}
                <span className="text-muted-foreground font-normal"> · {computeAge(guest.dob)} {t.form.yearsOld}</span>
              </p>
            </div>
          </div>
          {guest.notes && (
            <div className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 to-transparent">
              <StickyNote className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1">{t.form.notes}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{guest.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Pagination Controls ──────────────────────────────────────────────────────

function PaginationBar({
  pageIndex,
  pageCount,
  total,
  label,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  pageIndex: number;
  pageCount: number;
  total: number;
  label: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border/40 bg-muted/20">
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{total}</span> {label} ·
        page{" "}
        <span className="font-medium text-foreground">{pageIndex + 1}</span> /{" "}
        {pageCount}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={!canPrev}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canNext}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
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
  const blockUser = useMutation(api.users.blockUser);
  const deleteUserAsAdmin = useMutation(api.users.deleteUserAsAdmin);

  const [activeTab, setActiveTab] = useState<"hosts" | "guests">("hosts");
  const [hostSearch, setHostSearch] = useState("");
  const [guestSearch, setGuestSearch] = useState("");
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [blocking, setBlocking] = useState<string | null>(null);
  const [selectedHost, setSelectedHost] = useState<HostData | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    authUserId: string;
    name: string;
  } | null>(null);

  const [hostPagination, setHostPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [guestPagination, setGuestPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const isAdmin = currentUser?.role === "admin";
  const el = useEnumLabel();

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

  // TanStack Table — hosts
  const hostTableColumns = useMemo<ColumnDef<HostData>[]>(
    () => [{ id: "row", accessorFn: (r) => r._id }],
    [],
  );
  const hostTable = useReactTable({
    data: filteredHosts,
    columns: hostTableColumns,
    state: { pagination: hostPagination },
    onPaginationChange: setHostPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const paginatedHosts = hostTable.getRowModel().rows.map((r) => r.original);

  // TanStack Table — guests
  const guestTableColumns = useMemo<ColumnDef<GuestData>[]>(
    () => [{ id: "row", accessorFn: (r) => r._id }],
    [],
  );
  const guestTable = useReactTable({
    data: filteredGuests,
    columns: guestTableColumns,
    state: { pagination: guestPagination },
    onPaginationChange: setGuestPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const paginatedGuests = guestTable.getRowModel().rows.map((r) => r.original);

  // Reset page on search change
  useEffect(() => {
    setHostPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [hostSearch, showUnverifiedOnly]);
  useEffect(() => {
    setGuestPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [guestSearch]);

  const handleVerify = useCallback(
    async (userId: Id<"users">) => {
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
    },
    [verifyUser, t],
  );

  const handleBlock = useCallback(
    async (userId: Id<"users">, blocked: boolean) => {
      setBlocking(userId);
      try {
        await blockUser({ userId, blocked });
        toast.success(
          blocked ? t.people.blockSuccess : t.people.unblockSuccess,
        );
      } catch {
        toast.error(t.people.blockError);
      } finally {
        setBlocking(null);
      }
    },
    [blockUser, t],
  );

  const handleDeleteConfirmed = useCallback(async () => {
    if (!confirmDelete) return;
    try {
      await deleteUserAsAdmin({ authUserId: confirmDelete.authUserId });
      toast.success(t.people.deleteUserSuccess);
      setConfirmDelete(null);
      setSelectedHost(null);
      setSelectedGuest(null);
    } catch {
      toast.error(t.people.deleteUserError);
    }
  }, [confirmDelete, deleteUserAsAdmin, t]);

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

  const unverifiedCount = allHosts?.filter((h) => !h.isVerified).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t.people.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t.people.adminDesc}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border/60 overflow-hidden py-0 pb-5">
          <div className="h-0.5 bg-gradient-to-r from-violet-500/40 via-violet-500 to-violet-500/40" />
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {t.people.totalHosts}
                </p>
                <p className="text-3xl font-bold text-foreground tabular-nums">
                  <AnimatedNumber value={allHosts?.length ?? 0} />
                </p>
              </div>
              <div className="size-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <Home className="size-5 text-violet-600" />
              </div>
            </div>
            {unverifiedCount > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <Clock className="size-3 text-amber-500" />
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {unverifiedCount} {t.people.unverified.toLowerCase()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 overflow-hidden py-0 pb-5">
          <div className="h-0.5 bg-gradient-to-r from-emerald-500/40 via-emerald-500 to-emerald-500/40" />
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {t.people.totalGuests}
                </p>
                <p className="text-3xl font-bold text-foreground tabular-nums">
                  <AnimatedNumber value={allGuests?.length ?? 0} />
                </p>
              </div>
              <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Users className="size-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segment control */}
        <div className="inline-flex items-center rounded-xl border border-border bg-muted/50 p-1 gap-0.5 self-start">
          <button
            onClick={() => setActiveTab("hosts")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
              activeTab === "hosts"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className="size-3.5" />
            {t.people.hosts}
            <span
              className={cn(
                "tabular-nums text-[11px] px-1.5 py-0.5 rounded-full font-bold",
                activeTab === "hosts"
                  ? "bg-violet-500/10 text-violet-600"
                  : "bg-muted-foreground/10 text-muted-foreground",
              )}
            >
              {allHosts?.length ?? 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("guests")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
              activeTab === "guests"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Users className="size-3.5" />
            {t.people.guests}
            <span
              className={cn(
                "tabular-nums text-[11px] px-1.5 py-0.5 rounded-full font-bold",
                activeTab === "guests"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-muted-foreground/10 text-muted-foreground",
              )}
            >
              {allGuests?.length ?? 0}
            </span>
          </button>
        </div>

        {/* Unverified filter */}
        {isAdmin && activeTab === "hosts" && (
          <div className="flex items-center gap-2">
            <Switch
              id="unverified-filter"
              checked={showUnverifiedOnly}
              onCheckedChange={setShowUnverifiedOnly}
            />
            <Label
              htmlFor="unverified-filter"
              className="text-sm cursor-pointer"
            >
              {t.people.showUnverifiedOnly}
            </Label>
          </div>
        )}
      </div>

      {/* Hosts table */}
      {activeTab === "hosts" && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base text-foreground">
                {t.people.hosts}
              </CardTitle>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder={t.people.searchHosts}
                  value={hostSearch}
                  onChange={(e) => setHostSearch(e.target.value)}
                  className="pl-9 h-9"
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
                <Home className="size-8 opacity-40" />
                <p className="text-sm">{t.people.noHostsFound}</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/60">
                      <TableHead className="pl-5">{t.people.host}</TableHead>
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
                      {isAdmin && <TableHead>{t.people.status}</TableHead>}
                      {isAdmin && (
                        <TableHead className="pr-5 text-right">
                          {t.people.actions}
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHosts.map((host) => (
                      <TableRow
                        key={host._id}
                        onClick={() => setSelectedHost(host)}
                        className="cursor-pointer transition-colors hover:bg-accent/60 active:bg-accent border-b border-border/40 last:border-0"
                      >
                        <TableCell className="pl-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <Avatar className="size-9 border border-border/50">
                                <AvatarImage src={host.image} />
                                <AvatarFallback className="text-xs bg-violet-500/10 text-violet-600 font-semibold">
                                  {getInitials(host.name)}
                                </AvatarFallback>
                              </Avatar>
                              {host.isBlocked && (
                                <span className="absolute -bottom-0.5 -right-0.5 size-3.5 flex items-center justify-center rounded-full bg-destructive ring-1 ring-background">
                                  <Ban className="size-2 text-white" />
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-foreground text-sm truncate">
                                {host.name || t.people.unknown}
                              </span>
                              <span className="text-xs text-muted-foreground md:hidden truncate">
                                {host.address}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-3">
                          <a
                            href={mapsUrl(host.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-muted-foreground hover:text-violet-600 transition-colors underline-offset-4 hover:underline truncate max-w-[180px] block"
                          >
                            {host.address}
                          </a>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-3">
                          <EnumPill color="violet">
                            {el.sector(host.sector)}
                          </EnumPill>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-3">
                          <EnumPill color="blue">
                            {el.kashrout(host.kashrout)}
                          </EnumPill>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell py-3">
                          <EnumPill color="slate">
                            {el.ethnicity(host.ethnicity)}
                          </EnumPill>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell py-3">
                          {host.hasDisabilityAccess ? (
                            <Accessibility className="size-4 text-green-600" />
                          ) : (
                            <span className="text-xs text-muted-foreground/40">
                              —
                            </span>
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="py-3">
                            {host.isVerified ? (
                              <div className="flex items-center gap-1.5 text-green-600">
                                <CheckCircle2 className="size-3.5" />
                                <span className="text-xs hidden sm:inline font-medium">
                                  {t.people.confirmed}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-700 dark:text-amber-400 w-fit">
                                <Clock className="size-2.5 shrink-0" />
                                <span className="text-[10px] font-semibold whitespace-nowrap">
                                  {t.people.unverified}
                                </span>
                              </div>
                            )}
                          </TableCell>
                        )}
                        {isAdmin && (
                          <TableCell
                            className="pr-5 py-3 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 hover:bg-muted"
                                  disabled={blocking === host.userId}
                                >
                                  {blocking === host.userId ? (
                                    <Spinner className="size-3" />
                                  ) : (
                                    <MoreHorizontal className="size-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                {host.isBlocked ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleBlock(
                                        host.userId as Id<"users">,
                                        false,
                                      )
                                    }
                                    className="gap-2 cursor-pointer"
                                  >
                                    <ShieldOff className="size-3.5 text-green-600" />
                                    {t.people.unblock}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleBlock(
                                        host.userId as Id<"users">,
                                        true,
                                      )
                                    }
                                    className="gap-2 cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20"
                                  >
                                    <Ban className="size-3.5 text-amber-600" />
                                    {t.people.block}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmDelete({
                                      authUserId: host.authUserId,
                                      name: host.name || t.people.unknown,
                                    })
                                  }
                                  className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="size-3.5 text-destructive" />
                                  {t.people.deleteUser}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationBar
                  pageIndex={hostTable.getState().pagination.pageIndex}
                  pageCount={hostTable.getPageCount()}
                  total={filteredHosts.length}
                  label={t.people.hosts.toLowerCase()}
                  canPrev={hostTable.getCanPreviousPage()}
                  canNext={hostTable.getCanNextPage()}
                  onPrev={() => hostTable.previousPage()}
                  onNext={() => hostTable.nextPage()}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Guests table */}
      {activeTab === "guests" && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base text-foreground">
                {t.people.guests}
              </CardTitle>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder={t.people.searchGuests}
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="pl-9 h-9"
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
                <Users className="size-8 opacity-40" />
                <p className="text-sm">{t.people.noGuestsFound}</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/60">
                      <TableHead className="pl-5">{t.people.guest}</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        {t.form.address}
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
                      <TableHead className="hidden lg:table-cell">
                        {t.form.dateOfBirth}
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        {t.form.age}
                      </TableHead>
                      {isAdmin && (
                        <TableHead className="pr-5 text-right">
                          {t.people.actions}
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedGuests.map((guest) => (
                      <TableRow
                        key={guest._id}
                        onClick={() => setSelectedGuest(guest)}
                        className="cursor-pointer transition-colors hover:bg-accent/60 active:bg-accent border-b border-border/40 last:border-0"
                      >
                        <TableCell className="pl-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <Avatar className="size-9 border border-border/50">
                                <AvatarImage src={guest.image} />
                                <AvatarFallback className="text-xs bg-emerald-500/10 text-emerald-600 font-semibold">
                                  {getInitials(guest.name)}
                                </AvatarFallback>
                              </Avatar>
                              {guest.isBlocked && (
                                <span className="absolute -bottom-0.5 -right-0.5 size-3.5 flex items-center justify-center rounded-full bg-destructive ring-1 ring-background">
                                  <Ban className="size-2 text-white" />
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-foreground text-sm truncate">
                                {guest.name || t.people.unknown}
                              </span>
                              <span className="text-xs text-muted-foreground sm:hidden truncate">
                                {guest.region}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-3">
                          <a
                            href={mapsUrl(guest.region)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors underline-offset-4 hover:underline"
                          >
                            {guest.region}
                          </a>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-3">
                          <EnumPill color="emerald">
                            {el.sector(guest.sector)}
                          </EnumPill>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-3">
                          <EnumPill color="slate">
                            {el.ethnicity(guest.ethnicity)}
                          </EnumPill>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-3">
                          <EnumPill color={genderColor(guest.gender)}>
                            {el.gender(guest.gender)}
                          </EnumPill>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell py-3">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-3.5" />
                            <span className="text-xs">
                              {formatDate(guest.dob)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell py-3">
                          <span className="text-sm font-medium text-foreground tabular-nums">
                            {computeAge(guest.dob)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">
                            {t.form.yearsOld}
                          </span>
                        </TableCell>
                        {isAdmin && (
                          <TableCell
                            className="pr-5 py-3 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 hover:bg-muted"
                                  disabled={blocking === guest.userId}
                                >
                                  {blocking === guest.userId ? (
                                    <Spinner className="size-3" />
                                  ) : (
                                    <MoreHorizontal className="size-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                {guest.isBlocked ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleBlock(
                                        guest.userId as Id<"users">,
                                        false,
                                      )
                                    }
                                    className="gap-2 cursor-pointer"
                                  >
                                    <ShieldOff className="size-3.5 text-green-600" />
                                    {t.people.unblock}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleBlock(
                                        guest.userId as Id<"users">,
                                        true,
                                      )
                                    }
                                    className="gap-2 cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20"
                                  >
                                    <Ban className="size-3.5 text-amber-600" />
                                    {t.people.block}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmDelete({
                                      authUserId: guest.authUserId,
                                      name: guest.name || t.people.unknown,
                                    })
                                  }
                                  className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="size-3.5 text-destructive" />
                                  {t.people.deleteUser}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationBar
                  pageIndex={guestTable.getState().pagination.pageIndex}
                  pageCount={guestTable.getPageCount()}
                  total={filteredGuests.length}
                  label={t.people.guests.toLowerCase()}
                  canPrev={guestTable.getCanPreviousPage()}
                  canNext={guestTable.getCanNextPage()}
                  onPrev={() => guestTable.previousPage()}
                  onNext={() => guestTable.nextPage()}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Host detail dialog */}
      <HostDetailDialog
        host={selectedHost}
        isAdmin={isAdmin}
        verifying={verifying}
        onConfirm={handleVerify}
        onClose={() => setSelectedHost(null)}
      />

      {/* Guest detail dialog */}
      <GuestDetailDialog
        guest={selectedGuest}
        onClose={() => setSelectedGuest(null)}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.people.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {confirmDelete?.name}
              </span>
              {" — "}
              {t.people.deleteConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              <Trash2 className="size-4 mr-2" />
              {t.people.deleteUser}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
