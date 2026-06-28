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
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { HostListCard, type PublicHost } from "./host-list-card";
import { GuestSearchDialog } from "./guest-search-dialog";
import { RequestDialog } from "@/components/requests/request-dialog";
import {
  Search,
  MapPin,
  Loader2,
  Lock,
  SearchX,
  Send,
  ArrowLeft,
  Globe,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { isRegistrationIncomplete } from "@/lib/role-style";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSelect } from "@/components/ui/language-select";
import Link from "next/link";

const HostMapGoogle = dynamic(
  () =>
    import("./host-map-google").then((mod) => ({ default: mod.HostMapGoogle })),
  {
    ssr: false,
    loading: () => (
      <div className="size-full flex items-center justify-center bg-muted/50 rounded-xl">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    ),
  },
);

// Sentinel for the "all cities" choice in the city step.
const ALL_CITIES = "__all__";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Role-aware entry point: hosts (and dual guest:host) search guests to invite;
// everyone else searches hosts. We wait for the current user before choosing so
// the dialog doesn't flash the wrong direction.
export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { t } = useT();
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-3xl h-[80vh] sm:h-[78vh] flex items-center justify-center rounded-2xl">
          <DialogTitle className="sr-only">{t.search.title}</DialogTitle>
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </DialogContent>
      </Dialog>
    );
  }

  const guestMode =
    currentUser?.role === "host" || currentUser?.role === "guest:host";

  return guestMode ? (
    <GuestSearchDialog open={open} onOpenChange={onOpenChange} />
  ) : (
    <HostSearchDialog open={open} onOpenChange={onOpenChange} />
  );
}

function HostSearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { t } = useT();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHost, setSelectedHost] = useState<PublicHost | null>(null);
  const [requestHost, setRequestHost] = useState<PublicHost | null>(null);
  // City step: null = the picker is showing; a value (or ALL_CITIES) = chosen.
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  // Language filter (empty = no filtering).
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Load the available hosts once; all narrowing (city, language, and free-text
  // on name/address) happens client-side, so typing a host's name matches too.
  const hostsResult = useQuery(api.hosts.searchPublicHosts, {}) as
    | PublicHost[]
    | undefined;

  // Distinct cities with hosts, for the picker step.
  const cities = useQuery(api.hosts.getHostCities);

  // Keep the previous results visible while a new search is in flight, so the
  // list/map don't flash to a loader on every keystroke. Adjusting state during
  // render is the React-sanctioned alternative to caching in an effect.
  const [cachedHosts, setCachedHosts] = useState<PublicHost[] | undefined>(
    undefined,
  );
  if (hostsResult !== undefined && hostsResult !== cachedHosts) {
    setCachedHosts(hostsResult);
  }
  const hosts = hostsResult ?? cachedHosts;

  const isAuthenticated = currentUser !== null && currentUser !== undefined;
  // Everyone browses the same city → list → map flow. Full details (name,
  // address) are reserved for finalized members; signed-out visitors AND
  // signed-in-but-incomplete users (role "user") get an anonymized teaser
  // (redaction enforced server-side) and can't send a request — each is nudged
  // to the right next step (sign in / finish registration) from the action bar.
  const incompleteRegistration =
    isAuthenticated && isRegistrationIncomplete(currentUser?.role);
  const isAnonymous = currentUser === null;
  // Sending a hosting request additionally requires an admin-verified account.
  const isVerified = currentUser?.isVerified === true;
  const isLoading = hosts === undefined || currentUser === undefined;

  const allHosts = useMemo(() => hosts ?? [], [hosts]);

  const cityOf = useCallback((h: PublicHost) => h.city || h.address || "", []);

  // Step 2 list, narrowed to the chosen city (unless "all"), to hosts who speak
  // at least one of the selected languages, and to the free-text query — which
  // matches the host's name as well as their location.
  const filteredHosts = useMemo(() => {
    let result = allHosts;
    if (selectedCity && selectedCity !== ALL_CITIES) {
      result = result.filter((h) => cityOf(h) === selectedCity);
    }
    if (selectedLanguages.length > 0) {
      result = result.filter((h) =>
        h.languages?.some((l) => selectedLanguages.includes(l)),
      );
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((h) =>
        [h.name, h.address, h.city, h.neighborhood, h.street]
          .filter((v): v is string => !!v)
          .some((v) => v.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allHosts, selectedCity, cityOf, selectedLanguages, searchQuery]);

  // City list for the picker, filtered live by the search box.
  const visibleCities = useMemo(() => {
    if (!cities) return [];
    const q = searchQuery.trim().toLowerCase();
    return q
      ? cities.filter((c) => c.city.toLowerCase().includes(q))
      : cities;
  }, [cities, searchQuery]);

  const totalHostCount = useMemo(
    () => (cities ?? []).reduce((sum, c) => sum + c.count, 0),
    [cities],
  );

  const handleSelectHost = useCallback((host: PublicHost) => {
    setSelectedHost((prev) => (prev?._id === host._id ? null : host));
  }, []);

  const pickCity = useCallback((city: string) => {
    setSelectedCity(city);
    setSelectedHost(null);
    // Reset the box so step 2 starts on the full city list, ready for a
    // name search.
    setSearchQuery("");
  }, []);

  const backToCities = useCallback(() => {
    setSelectedCity(null);
    setSelectedHost(null);
    setSearchQuery("");
  }, []);

  const resultsLabel =
    filteredHosts.length === 1
      ? t.search.hostsInCity
      : t.search.hostsInCityPlural;

  const inCityStep = selectedCity === null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-5xl h-[80vh] max-h-[calc(100dvh-2rem)] sm:h-[78vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl"
        showCloseButton
      >
        {/* Header — gradient accent (host = sky, cohérent avec le dashboard) */}
        <DialogHeader className="relative bg-gradient-to-b from-primary/8 to-transparent px-6 pt-6 pb-4 shrink-0 text-start border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/15">
              <MapPin className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold tracking-tight">
                {t.search.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t.search.searchBarPlaceholder}
              </DialogDescription>
              {!isLoading && !inCityStep && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-semibold text-foreground tabular-nums">
                    {filteredHosts.length}
                  </span>{" "}
                  {resultsLabel}
                </p>
              )}
              {!isLoading && inCityStep && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.search.chooseCityHint}
                </p>
              )}
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={
                inCityStep ? t.search.cityPlaceholder : t.search.placeholder
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-11 rounded-xl bg-background/80 border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 transition-colors"
            />
          </div>

          {/* Step-2 controls: change-city chip + language filter */}
          {!isLoading && selectedCity !== null && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={backToCities}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 ps-2.5 pe-3 py-1 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                {selectedCity === ALL_CITIES
                  ? t.search.allCities
                  : selectedCity}
                <span className="text-primary/60">
                  · {t.search.changeCity}
                </span>
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

        {/* Body */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : inCityStep ? (
          /* Step 1 — pick a city among those with hosts */
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-3">
                {/* Toutes les villes — featured entry */}
                <button
                  type="button"
                  onClick={() => pickCity(ALL_CITIES)}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-primary/25 bg-primary/8 p-3.5 text-start transition-colors hover:border-primary/45 hover:bg-primary/12"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-transform group-hover:scale-105">
                    <Globe className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">
                      {t.search.allCities}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {totalHostCount} {t.search.hostsInCityPlural}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-primary/50 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>

                {visibleCities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleCities.map(({ city, count }) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => pickCity(city)}
                        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 text-start transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                          <MapPin className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {city}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {count}{" "}
                            {count === 1
                              ? t.search.hostsInCity
                              : t.search.hostsInCityPlural}
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
                    <p className="text-sm">{t.search.noResults}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            /* Step 2 — host list + map for the chosen city */
            <>
              <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
                <ScrollArea className="w-full sm:w-[38%] shrink-0">
                  <div className="p-4 flex flex-col gap-2">
                    {filteredHosts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-3 text-muted-foreground">
                        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                          <SearchX className="size-5" />
                        </div>
                        <p className="text-sm">{t.search.noResults}</p>
                      </div>
                    ) : (
                      filteredHosts.map((host) => (
                        <HostListCard
                          key={host._id}
                          host={host}
                          isSelected={selectedHost?._id === host._id}
                          onSelect={handleSelectHost}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>

                <Separator orientation="vertical" className="hidden sm:block" />

                <div className="flex-1 min-h-[250px] sm:min-h-0 p-4">
                  <div className="size-full rounded-xl overflow-hidden border border-border/60">
                    <HostMapGoogle
                      hosts={filteredHosts}
                      selectedHost={selectedHost}
                      onSelectHost={handleSelectHost}
                    />
                  </div>
                </div>
              </div>

              {/* Action bar — appears when a host is selected */}
              {selectedHost && (
                <div className="shrink-0 border-t border-border/50 bg-background/95 px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {selectedHost.name ?? t.search.anonymousHost}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedHost.neighborhood
                        ? `${selectedHost.neighborhood}${selectedHost.city ? ` · ${selectedHost.city}` : ""}`
                        : selectedHost.city || selectedHost.address}
                    </p>
                  </div>
                  {isAnonymous ? (
                    <Button
                      asChild
                      size="sm"
                      className="gap-2 shrink-0"
                      onClick={() => onOpenChange(false)}
                    >
                      <Link href="/login">
                        <Lock className="size-4" />
                        {t.search.signInToContact}
                      </Link>
                    </Button>
                  ) : incompleteRegistration ? (
                    <Button
                      asChild
                      size="sm"
                      className="gap-2 shrink-0"
                      onClick={() => onOpenChange(false)}
                    >
                      <Link href="/complete-registration">
                        <Lock className="size-4" />
                        {t.nav.finishRegistration}
                      </Link>
                    </Button>
                  ) : isVerified ? (
                    <Button
                      size="sm"
                      className="gap-2 shrink-0"
                      onClick={() => setRequestHost(selectedHost)}
                    >
                      <Send className="size-4" />
                      {t.requests.sendRequest}
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

      {requestHost && (
        <RequestDialog
          open={!!requestHost}
          onOpenChange={(o) => !o && setRequestHost(null)}
          hostId={requestHost._id}
          hostName={requestHost.name ?? ""}
        />
      )}
    </Dialog>
  );
}
