"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
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
import { Home, Users, ShieldAlert, Clock, Trash2 } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import { useT } from "@/lib/i18n/context";
import { toast } from "sonner";
import { type Id } from "@/convex/_generated/dataModel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/app/dashboard/_components/dashboard-page-ui/page-header";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { HostData, GuestData } from "./_lib/types";
import { HostDetailDialog } from "./_components/host-detail-dialog";
import { GuestDetailDialog } from "./_components/guest-detail-dialog";
import { HostsTable } from "./_components/hosts-table";
import { GuestsTable } from "./_components/guests-table";

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
  const [bulkBusy, setBulkBusy] = useState(false);
  const [selectedHost, setSelectedHost] = useState<HostData | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    authUserId: string;
    name: string;
  } | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // Multi-select state (keyed by authUserId)
  const [selectedHostIds, setSelectedHostIds] = useState<Set<string>>(new Set());
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());

  const [hostPagination, setHostPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [guestPagination, setGuestPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
      const matchesVerified =
        !showUnverifiedOnly || (!host.isVerified && host.role !== "admin");
      return matchesSearch && matchesVerified;
    });
  }, [allHosts, hostSearch, showUnverifiedOnly]);

  const filteredGuests = useMemo(() => {
    if (!allGuests) return [];
    return allGuests.filter((guest) => {
      const search = guestSearch.toLowerCase();
      const matchesSearch =
        !search ||
        guest.name?.toLowerCase().includes(search) ||
        guest.region?.toLowerCase().includes(search) ||
        guest.sector?.toLowerCase().includes(search);
      const matchesVerified =
        !showUnverifiedOnly || (!guest.isVerified && guest.role !== "admin");
      return matchesSearch && matchesVerified;
    });
  }, [allGuests, guestSearch, showUnverifiedOnly]);

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

  // Reset page + clear selection on filter changes
  useEffect(() => {
    setHostPagination((p) => ({ ...p, pageIndex: 0 }));
    setSelectedHostIds(new Set());
  }, [hostSearch, showUnverifiedOnly]);
  useEffect(() => {
    setGuestPagination((p) => ({ ...p, pageIndex: 0 }));
    setSelectedGuestIds(new Set());
  }, [guestSearch, showUnverifiedOnly]);
  // Also clear on tab switch
  useEffect(() => {
    setSelectedHostIds(new Set());
    setSelectedGuestIds(new Set());
  }, [activeTab]);

  // Single-row selection helpers
  const toggleHostSelect = useCallback((authUserId: string) => {
    setSelectedHostIds((prev) => {
      const next = new Set(prev);
      if (next.has(authUserId)) next.delete(authUserId);
      else next.add(authUserId);
      return next;
    });
  }, []);
  const toggleGuestSelect = useCallback((authUserId: string) => {
    setSelectedGuestIds((prev) => {
      const next = new Set(prev);
      if (next.has(authUserId)) next.delete(authUserId);
      else next.add(authUserId);
      return next;
    });
  }, []);

  // Range selection helpers (Shift+click) — deselect=true removes, false adds
  const selectHostRange = useCallback((authUserIds: string[], deselect: boolean) => {
    setSelectedHostIds((prev) => {
      const next = new Set(prev);
      authUserIds.forEach((id) => (deselect ? next.delete(id) : next.add(id)));
      return next;
    });
  }, []);
  const selectGuestRange = useCallback((authUserIds: string[], deselect: boolean) => {
    setSelectedGuestIds((prev) => {
      const next = new Set(prev);
      authUserIds.forEach((id) => (deselect ? next.delete(id) : next.add(id)));
      return next;
    });
  }, []);

  const handleVerify = useCallback(
    async (userId: Id<"users">) => {
      setVerifying(userId);
      try {
        await verifyUser({ userId });
        toast.success(t.people.confirmSuccess);
        setSelectedHost(null);
        setSelectedGuest(null);
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

  // --- Bulk actions ---
  const currentSelectedIds =
    activeTab === "hosts" ? selectedHostIds : selectedGuestIds;
  const currentAllRows =
    activeTab === "hosts" ? (allHosts ?? []) : (allGuests ?? []);
  const selectionCount = currentSelectedIds.size;
  const canBulkVerify = currentAllRows.some(
    (r) =>
      currentSelectedIds.has(r.authUserId) &&
      !r.isVerified &&
      r.role !== "admin",
  );

  const handleBulkVerify = useCallback(async () => {
    if (!allHosts && !allGuests) return;
    setBulkBusy(true);
    // Only verify non-admin, unverified users in the selection
    const rows = currentAllRows.filter(
      (r) =>
        currentSelectedIds.has(r.authUserId) &&
        !r.isVerified &&
        r.role !== "admin",
    );
    if (rows.length === 0) {
      toast.info(t.people.confirmSuccess);
      setBulkBusy(false);
      return;
    }
    const results = await Promise.allSettled(
      rows.map((r) => verifyUser({ userId: r.userId as Id<"users"> })),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const fail = results.filter((r) => r.status === "rejected").length;
    if (ok > 0) toast.success(`${ok} ${t.people.bulkVerifySuccess}`);
    if (fail > 0) toast.error(`${fail} ${t.people.confirmError}`);
    if (activeTab === "hosts") setSelectedHostIds(new Set());
    else setSelectedGuestIds(new Set());
    setBulkBusy(false);
  }, [currentAllRows, currentSelectedIds, verifyUser, allHosts, allGuests, activeTab, t]);

  const handleBulkBlock = useCallback(async () => {
    setBulkBusy(true);
    const rows = currentAllRows.filter((r) =>
      currentSelectedIds.has(r.authUserId),
    );
    const results = await Promise.allSettled(
      rows.map((r) =>
        blockUser({ userId: r.userId as Id<"users">, blocked: true }),
      ),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const fail = results.filter((r) => r.status === "rejected").length;
    if (ok > 0) toast.success(`${ok} ${t.people.bulkBlockSuccess}`);
    if (fail > 0) toast.error(`${fail} ${t.people.blockError}`);
    if (activeTab === "hosts") setSelectedHostIds(new Set());
    else setSelectedGuestIds(new Set());
    setBulkBusy(false);
  }, [currentAllRows, currentSelectedIds, blockUser, activeTab, t]);

  const handleBulkDeleteConfirmed = useCallback(async () => {
    setBulkBusy(true);
    setConfirmBulkDelete(false);
    const rows = currentAllRows.filter((r) =>
      currentSelectedIds.has(r.authUserId),
    );
    const results = await Promise.allSettled(
      rows.map((r) => deleteUserAsAdmin({ authUserId: r.authUserId })),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const fail = results.filter((r) => r.status === "rejected").length;
    if (ok > 0) toast.success(`${ok} ${t.people.bulkDeleteSuccess}`);
    if (fail > 0) toast.error(`${fail} ${t.people.deleteUserError}`);
    if (activeTab === "hosts") setSelectedHostIds(new Set());
    else setSelectedGuestIds(new Set());
    setBulkBusy(false);
  }, [currentAllRows, currentSelectedIds, deleteUserAsAdmin, activeTab, t]);

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
          <p className="font-semibold text-foreground">
            {t.people.accessDenied}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.people.accessDeniedDesc}
          </p>
        </div>
      </div>
    );
  }

  const unverifiedCount =
    allHosts?.filter((h) => !h.isVerified && h.role !== "admin").length ?? 0;
  const guestUnverifiedCount =
    allGuests?.filter((g) => !g.isVerified && g.role !== "admin").length ?? 0;

  return (
    <div>
      <PageHeader title={t.people.title} subtitle={t.people.adminDesc} />

      <div className="flex flex-col gap-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border/60">
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {t.people.totalHosts}
                  </p>
                  <p className="text-3xl font-bold text-foreground tabular-nums">
                    {allHosts?.length ?? 0}
                  </p>
                </div>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Home className="size-5 text-primary" />
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

          <Card className="border-border/60">
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {t.people.totalGuests}
                  </p>
                  <p className="text-3xl font-bold text-foreground tabular-nums">
                    {allGuests?.length ?? 0}
                  </p>
                </div>
                <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Users className="size-5 text-amber-600" />
                </div>
              </div>
              {guestUnverifiedCount > 0 && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Clock className="size-3 text-amber-500" />
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {guestUnverifiedCount} {t.people.unverified.toLowerCase()}
                  </span>
                </div>
              )}
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
                    ? "bg-primary/10 text-primary"
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
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-muted-foreground/10 text-muted-foreground",
                )}
              >
                {allGuests?.length ?? 0}
              </span>
            </button>
          </div>

          {/* Unverified filter */}
          {isAdmin && (
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
          <HostsTable
            table={hostTable}
            rows={paginatedHosts}
            isLoading={allHosts === undefined}
            total={filteredHosts.length}
            search={hostSearch}
            onSearchChange={setHostSearch}
            isAdmin={isAdmin}
            onRowClick={setSelectedHost}
            blocking={blocking}
            verifying={verifying}
            onBlock={handleBlock}
            onVerify={handleVerify}
            onDelete={setConfirmDelete}
            selectedIds={selectedHostIds}
            onToggleSelect={toggleHostSelect}
            onSelectRange={selectHostRange}
            bulkBusy={bulkBusy}
            canBulkVerify={canBulkVerify}
            onBulkVerify={handleBulkVerify}
            onBulkBlock={handleBulkBlock}
            onBulkDelete={() => setConfirmBulkDelete(true)}
            onClearSelection={() => setSelectedHostIds(new Set())}
          />
        )}

        {/* Guests table */}
        {activeTab === "guests" && (
          <GuestsTable
            table={guestTable}
            rows={paginatedGuests}
            isLoading={allGuests === undefined}
            total={filteredGuests.length}
            search={guestSearch}
            onSearchChange={setGuestSearch}
            isAdmin={isAdmin}
            onRowClick={setSelectedGuest}
            blocking={blocking}
            verifying={verifying}
            onBlock={handleBlock}
            onVerify={handleVerify}
            onDelete={setConfirmDelete}
            selectedIds={selectedGuestIds}
            onToggleSelect={toggleGuestSelect}
            onSelectRange={selectGuestRange}
            bulkBusy={bulkBusy}
            canBulkVerify={canBulkVerify}
            onBulkVerify={handleBulkVerify}
            onBulkBlock={handleBulkBlock}
            onBulkDelete={() => setConfirmBulkDelete(true)}
            onClearSelection={() => setSelectedGuestIds(new Set())}
          />
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
          isAdmin={isAdmin}
          verifying={verifying}
          onConfirm={handleVerify}
          onClose={() => setSelectedGuest(null)}
        />

        {/* Single delete confirmation */}
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

        {/* Bulk delete confirmation */}
        <AlertDialog
          open={confirmBulkDelete}
          onOpenChange={setConfirmBulkDelete}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t.people.bulkDeleteConfirmTitle}
              </AlertDialogTitle>
              <AlertDialogDescription>
                <span className="font-medium text-foreground">
                  {selectionCount} {t.people.selected}
                </span>
                {" — "}
                {t.people.bulkDeleteConfirmDesc}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDeleteConfirmed}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                <Trash2 className="size-4 mr-2" />
                {t.people.bulkDelete}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
