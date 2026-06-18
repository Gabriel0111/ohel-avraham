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
import {
  Home,
  Search,
  Accessibility,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";
import type { Table as ReactTable } from "@tanstack/react-table";
import { useEnumLabel, useT } from "@/lib/i18n/context";
import { type Id } from "@/convex/_generated/dataModel";
import { EnumPill } from "@/components/ui/enum-pill";
import type { HostData } from "../_lib/types";
import { getInitials, mapsUrl } from "../_lib/utils";
import { RowActionsMenu } from "./row-actions-menu";
import { PaginationBar } from "./pagination-bar";

export function HostsTable({
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
  table: ReactTable<HostData>;
  rows: HostData[];
  isLoading: boolean;
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  isAdmin: boolean;
  onRowClick: (host: HostData) => void;
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
            {t.people.hosts}
          </CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t.people.searchHosts}
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
                {rows.map((host) => (
                  <TableRow
                    key={host._id}
                    onClick={() => onRowClick(host)}
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
                      <EnumPill color="violet">{el.sector(host.sector)}</EnumPill>
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
                        <span className="text-xs text-muted-foreground/40">—</span>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="py-3">
                        {host.isVerified ? (
                          <EnumPill color="green" icon={CheckCircle2}>
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
                          userId={host.userId as Id<"users">}
                          authUserId={host.authUserId}
                          name={host.name || t.people.unknown}
                          isBlocked={host.isBlocked}
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
              label={t.people.hosts.toLowerCase()}
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
