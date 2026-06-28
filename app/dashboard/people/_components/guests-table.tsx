"use client";

import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
  Users,
  Search,
  Ban,
  Clock,
  ShieldCheck,
  Trash2,
  MoreHorizontal,
  X,
} from "lucide-react";
import type { Table as ReactTable } from "@tanstack/react-table";
import { useT } from "@/lib/i18n/context";
import { type Id } from "@/convex/_generated/dataModel";
import { EnumPill } from "@/components/ui/enum-pill";
import {
  EthnicityBadge,
  GenderBadge,
  SectorBadge,
} from "@/components/ui/enum-badges";
import { LanguageFlags } from "@/components/ui/language-flags";
import type { GuestData } from "../_lib/types";
import { getInitials, formatDate, mapsUrl, computeAge } from "../_lib/utils";
import { RowActionsMenu } from "./row-actions-menu";
import { PaginationBar } from "./pagination-bar";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function GuestsTable({
  table,
  rows,
  isLoading,
  total,
  search,
  onSearchChange,
  isAdmin,
  onRowClick,
  blocking,
  verifying,
  onBlock,
  onVerify,
  onDelete,
  selectedIds,
  onToggleSelect,
  onSelectRange,
  bulkBusy,
  canBulkVerify,
  onBulkVerify,
  onBulkBlock,
  onBulkDelete,
  onClearSelection,
}: {
  table: ReactTable<GuestData>;
  rows: GuestData[];
  isLoading: boolean;
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  isAdmin: boolean;
  onRowClick: (guest: GuestData) => void;
  blocking: string | null;
  verifying: string | null;
  onBlock: (userId: Id<"users">, blocked: boolean) => void;
  onVerify: (userId: Id<"users">) => void;
  onDelete: (info: { authUserId: string; name: string }) => void;
  selectedIds: Set<string>;
  onToggleSelect: (authUserId: string) => void;
  onSelectRange: (authUserIds: string[], deselect: boolean) => void;
  bulkBusy: boolean;
  canBulkVerify: boolean;
  onBulkVerify: () => void;
  onBulkBlock: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}) {
  const { t } = useT();
  const lastClickedIdRef = useRef<string | null>(null);
  const selectionCount = selectedIds.size;

  const computeRange = (idx: number): string[] | null => {
    if (lastClickedIdRef.current === null) return null;
    const anchorIdx = rows.findIndex((r) => r.authUserId === lastClickedIdRef.current);
    if (anchorIdx === -1) return null;
    const lo = Math.min(anchorIdx, idx);
    const hi = Math.max(anchorIdx, idx);
    return rows.slice(lo, hi + 1).map((r) => r.authUserId);
  };

  const handleRowClick = (guest: GuestData, idx: number, e: React.MouseEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      const range = computeRange(idx);
      if (range) {
        const deselect = selectedIds.has(guest.authUserId);
        onSelectRange(range, deselect);
      }
      lastClickedIdRef.current = guest.authUserId;
      return;
    }
    onRowClick(guest);
    lastClickedIdRef.current = guest.authUserId;
  };

  const handleCheckboxClick = (guest: GuestData, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      e.preventDefault();
      const range = computeRange(idx);
      if (range) {
        const deselect = selectedIds.has(guest.authUserId);
        onSelectRange(range, deselect);
      }
    } else {
      onToggleSelect(guest.authUserId);
    }
    lastClickedIdRef.current = guest.authUserId;
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base text-foreground shrink-0">
            {t.people.guests}
          </CardTitle>

          {isAdmin && selectionCount > 0 ? (
            /* Bulk action bar — replaces search when items are selected */
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="text-sm font-medium text-amber-600 tabular-nums whitespace-nowrap">
                {selectionCount} {t.people.selected}
              </span>
              {/* Full action buttons — hidden on small screens */}
              <div className="hidden sm:flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={bulkBusy || !canBulkVerify}
                  onClick={onBulkVerify}
                  className="gap-1.5 h-9 text-xs text-green-700 border-green-600/30 hover:bg-green-50 dark:hover:bg-green-950/20 disabled:opacity-40"
                >
                  <ShieldCheck className="size-3.5" />
                  {t.people.bulkVerify}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={bulkBusy}
                  onClick={onBulkBlock}
                  className="gap-1.5 h-9 text-xs text-amber-700 border-amber-600/30 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                >
                  <Ban className="size-3.5" />
                  {t.people.bulkBlock}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={bulkBusy}
                  onClick={onBulkDelete}
                  className="gap-1.5 h-9 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" />
                  {t.people.bulkDelete}
                </Button>
              </div>
              {/* Collapsed menu — visible on small screens */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" disabled={bulkBusy}>
                      <MoreHorizontal className="size-3.5" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={onBulkVerify} disabled={!canBulkVerify} className="gap-2 text-green-700 focus:text-green-700 focus:bg-green-50 dark:focus:bg-green-950/20">
                      <ShieldCheck className="size-3.5" />
                      {t.people.bulkVerify}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onBulkBlock} className="gap-2 text-amber-700 focus:text-amber-700 focus:bg-amber-50 dark:focus:bg-amber-950/20">
                      <Ban className="size-3.5" />
                      {t.people.bulkBlock}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onBulkDelete} className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="size-3.5" />
                      {t.people.bulkDelete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={bulkBusy}
                onClick={onClearSelection}
                className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ) : (
            /* Normal search bar */
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={t.people.searchGuests}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-6" />
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <Users className="size-8 opacity-40" />
            <p className="text-sm">{t.people.noGuestsFound}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/60">
                  {isAdmin && <TableHead className="w-10 pl-4" />}
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
                  <TableHead className="hidden xl:table-cell">
                    {t.form.languages}
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">
                    {t.people.registeredAt}
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
                {rows.map((guest, idx) => {
                  const isSelected = selectedIds.has(guest.authUserId);
                  return (
                    <TableRow
                      key={guest._id}
                      onClick={(e) => handleRowClick(guest, idx, e)}
                      className={cn(
                        "cursor-pointer transition-colors border-b border-border/40 last:border-0 select-none",
                        isSelected
                          ? "bg-amber-500/5 hover:bg-amber-500/8"
                          : "hover:bg-accent/60 active:bg-accent",
                      )}
                    >
                      {isAdmin && (
                        <TableCell
                          className="w-10 pl-4 py-3"
                          onClick={(e) => handleCheckboxClick(guest, idx, e)}
                        >
                          <Checkbox
                            checked={isSelected}
                            aria-label={`Select ${guest.name}`}
                            className="pointer-events-none"
                          />
                        </TableCell>
                      )}
                      <TableCell className="pl-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar className="size-9 border border-border/50">
                              <AvatarImage src={guest.image} />
                              <AvatarFallback className="text-xs bg-amber-500/10 text-amber-600 font-semibold">
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
                          className="text-sm text-muted-foreground hover:text-amber-600 transition-colors underline-offset-4 hover:underline"
                        >
                          {guest.region}
                        </a>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-3">
                        <SectorBadge value={guest.sector} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-3">
                        <EthnicityBadge value={guest.ethnicity} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-3">
                        <GenderBadge value={guest.gender} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell py-3">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(guest.dob)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell py-3">
                        <span className="text-sm font-medium text-foreground tabular-nums">
                          {computeAge(guest.dob)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {t.form.yearsOld}
                        </span>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell py-3">
                        <LanguageFlags value={guest.languages} />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell py-3">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(guest._creationTime)}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="py-3">
                          {guest.isBlocked ? (
                            <EnumPill color="red" icon={Ban}>
                              {t.people.blocked}
                            </EnumPill>
                          ) : guest.role === "admin" || guest.isVerified ? (
                            <EnumPill color="green" icon={ShieldCheck}>
                              {t.people.confirmed}
                            </EnumPill>
                          ) : (
                            <EnumPill color="amber" icon={Clock}>
                              {t.people.unverified}
                            </EnumPill>
                          )}
                        </TableCell>
                      )}
                      {isAdmin && (
                        <TableCell
                          className="pr-5 py-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <RowActionsMenu
                            userId={guest.userId as Id<"users">}
                            authUserId={guest.authUserId}
                            name={guest.name || t.people.unknown}
                            isBlocked={guest.isBlocked}
                            isVerified={guest.isVerified}
                            role={guest.role ?? "user"}
                            blocking={blocking}
                            verifying={verifying}
                            onBlock={onBlock}
                            onVerify={onVerify}
                            onDelete={onDelete}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <PaginationBar
              pageIndex={table.getState().pagination.pageIndex}
              pageCount={table.getPageCount()}
              total={total}
              label={t.people.guests.toLowerCase()}
              canPrev={table.getCanPreviousPage()}
              canNext={table.getCanNextPage()}
              onPrev={() => table.previousPage()}
              onNext={() => table.nextPage()}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
