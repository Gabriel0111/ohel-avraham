"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { GuestListCard, type PublicGuest } from "./guest-list-card";
import { InviteDialog } from "@/components/requests/invite-dialog";
import {
  Search,
  MapPin,
  Loader2,
  SearchX,
  Send,
  ArrowLeft,
  Globe,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSelect } from "@/components/ui/language-select";

// Sentinel for the "all regions" choice in the region step.
const ALL_REGIONS = "__all__";

interface GuestSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Host → guest search. Mirrors the host SearchDialog (region picker → list) but
// without a map (guests carry only a region, no coordinates); a selected guest
// can be invited to the host's table.
export function GuestSearchDialog({
  open,
  onOpenChange,
}: GuestSearchDialogProps) {
  const { t } = useT();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<PublicGuest | null>(null);
  const [inviteGuest, setInviteGuest] = useState<PublicGuest | null>(null);
  // Region step: null = the picker is showing; a value (or ALL_REGIONS) = chosen.
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const guestsResult = useQuery(api.guests.searchPublicGuests, {}) as
    | PublicGuest[]
    | undefined;
  const regions = useQuery(api.guests.getGuestRegions);

  // Keep previous results visible while a new query is in flight.
  const [cachedGuests, setCachedGuests] = useState<PublicGuest[] | undefined>(
    undefined,
  );
  if (guestsResult !== undefined && guestsResult !== cachedGuests) {
    setCachedGuests(guestsResult);
  }
  const guests = guestsResult ?? cachedGuests;

  // Inviting requires an admin-verified host account.
  const isVerified = currentUser?.isVerified === true;
  const isLoading = guests === undefined || currentUser === undefined;

  const allGuests = useMemo(() => guests ?? [], [guests]);

  const filteredGuests = useMemo(() => {
    let result = allGuests;
    if (selectedRegion && selectedRegion !== ALL_REGIONS) {
      result = result.filter((g) => g.region === selectedRegion);
    }
    if (selectedLanguages.length > 0) {
      result = result.filter((g) =>
        g.languages?.some((l) => selectedLanguages.includes(l)),
      );
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((g) =>
        [g.name, g.region]
          .filter((v): v is string => !!v)
          .some((v) => v.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allGuests, selectedRegion, selectedLanguages, searchQuery]);

  const visibleRegions = useMemo(() => {
    if (!regions) return [];
    const q = searchQuery.trim().toLowerCase();
    return q
      ? regions.filter((r) => r.region.toLowerCase().includes(q))
      : regions;
  }, [regions, searchQuery]);

  const totalGuestCount = useMemo(
    () => (regions ?? []).reduce((sum, r) => sum + r.count, 0),
    [regions],
  );

  const handleSelectGuest = useCallback((guest: PublicGuest) => {
    setSelectedGuest((prev) => (prev?._id === guest._id ? null : guest));
  }, []);

  const pickRegion = useCallback((region: string) => {
    setSelectedRegion(region);
    setSelectedGuest(null);
    setSearchQuery("");
  }, []);

  const backToRegions = useCallback(() => {
    setSelectedRegion(null);
    setSelectedGuest(null);
    setSearchQuery("");
  }, []);

  const resultsLabel =
    filteredGuests.length === 1
      ? t.search.guestsInRegion
      : t.search.guestsInRegionPlural;

  const inRegionStep = selectedRegion === null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-3xl h-[80vh] max-h-[calc(100dvh-2rem)] sm:h-[78vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl"
        showCloseButton
      >
        <DialogHeader className="relative bg-gradient-to-b from-primary/8 to-transparent px-6 pt-6 pb-4 shrink-0 text-start border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/15">
              <MapPin className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold tracking-tight">
                {t.search.guestTitle}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t.search.searchGuestsBarPlaceholder}
              </DialogDescription>
              {!isLoading && !inRegionStep && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-semibold text-foreground tabular-nums">
                    {filteredGuests.length}
                  </span>{" "}
                  {resultsLabel}
                </p>
              )}
              {!isLoading && inRegionStep && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.search.chooseRegionHint}
                </p>
              )}
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={
                inRegionStep
                  ? t.search.regionPlaceholder
                  : t.search.guestPlaceholder
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-11 rounded-xl bg-background/80 border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 transition-colors"
            />
          </div>

          {!isLoading && selectedRegion !== null && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={backToRegions}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 ps-2.5 pe-3 py-1 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                {selectedRegion === ALL_REGIONS
                  ? t.search.allRegions
                  : selectedRegion}
                <span className="text-primary/60">· {t.search.changeCity}</span>
              </button>
              <LanguageSelect
                value={selectedLanguages}
                onChange={setSelectedLanguages}
                placeholder={t.search.filterByLanguage}
                className="h-8 w-auto min-w-0 ms-auto max-w-[65%] sm:max-w-xs"
              />
            </div>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : inRegionStep ? (
          /* Step 1 — pick a region among those with guests */
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-3">
              <button
                type="button"
                onClick={() => pickRegion(ALL_REGIONS)}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-primary/25 bg-primary/8 p-3.5 text-start transition-colors hover:border-primary/45 hover:bg-primary/12"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-transform group-hover:scale-105">
                  <Globe className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">
                    {t.search.allRegions}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {totalGuestCount} {t.search.guestsInRegionPlural}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-primary/50 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>

              {visibleRegions.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleRegions.map(({ region, count }) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => pickRegion(region)}
                      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 text-start transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                        <MapPin className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {region}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {count}{" "}
                          {count === 1
                            ? t.search.guestsInRegion
                            : t.search.guestsInRegionPlural}
                        </p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-3 text-muted-foreground">
                  <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                    <SearchX className="size-5" />
                  </div>
                  <p className="text-sm">{t.search.noGuests}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          /* Step 2 — guest list for the chosen region (no map) */
          <>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filteredGuests.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-4 gap-3 text-muted-foreground">
                    <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                      <SearchX className="size-5" />
                    </div>
                    <p className="text-sm">{t.search.noGuests}</p>
                  </div>
                ) : (
                  filteredGuests.map((guest) => (
                    <GuestListCard
                      key={guest._id}
                      guest={guest}
                      isSelected={selectedGuest?._id === guest._id}
                      onSelect={handleSelectGuest}
                    />
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Action bar — appears when a guest is selected */}
            {selectedGuest && (
              <div className="shrink-0 border-t border-border/50 bg-background/95 px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {selectedGuest.name ?? t.search.anonymousGuest}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedGuest.region}
                  </p>
                </div>
                {isVerified ? (
                  <Button
                    size="sm"
                    className="gap-2 shrink-0"
                    onClick={() => setInviteGuest(selectedGuest)}
                  >
                    <Send className="size-4" />
                    {t.search.inviteAction}
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground max-w-[55%] text-end">
                    <ShieldAlert className="size-4 shrink-0 text-amber-500" />
                    <span>{t.requests.notVerifiedHint}</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>

      {inviteGuest && (
        <InviteDialog
          open={!!inviteGuest}
          onOpenChange={(o) => !o && setInviteGuest(null)}
          guestId={inviteGuest._id}
          guestName={inviteGuest.name ?? ""}
        />
      )}
    </Dialog>
  );
}
