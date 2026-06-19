import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Users, Search, Ban } from "lucide-react";
import type { Table as ReactTable } from "@tanstack/react-table";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import { type Id } from "@/convex/_generated/dataModel";
import { EnumPill, genderColor } from "@/components/ui/enum-pill";
import { LanguageFlags } from "@/components/ui/language-flags";
import type { GuestData } from "../_lib/types";
import { getInitials, formatDate, mapsUrl, computeAge } from "../_lib/utils";
import { RowActionsMenu } from "./row-actions-menu";
import { PaginationBar } from "./pagination-bar";

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
  onBlock,
  onDelete,
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
  onBlock: (userId: Id<"users">, blocked: boolean) => void;
  onDelete: (info: { authUserId: string; name: string }) => void;
}) {
  const { t } = useT();
  const el = useEnumLabel();

  return (
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
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
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
                  {isAdmin && (
                    <TableHead className="pr-5 text-right">
                      {t.people.actions}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((guest) => (
                  <TableRow
                    key={guest._id}
                    onClick={() => onRowClick(guest)}
                    className="cursor-pointer transition-colors hover:bg-accent/60 active:bg-accent border-b border-border/40 last:border-0"
                  >
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
                      <EnumPill color="amber">{el.sector(guest.sector)}</EnumPill>
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
                          blocking={blocking}
                          onBlock={onBlock}
                          onDelete={onDelete}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
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
