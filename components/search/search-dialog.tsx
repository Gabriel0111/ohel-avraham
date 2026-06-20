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
import { RequestDialog } from "@/components/requests/request-dialog";
import {
  Search,
  MapPin,
  Loader2,
  Users,
  Lock,
  SearchX,
  Send,
  ArrowLeft,
  Globe,
  ChevronRight,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
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

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
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
  const isLoading = hosts === undefined || currentUser === undefined;

  const allHosts = useMemo(() => hosts ?? [], [hosts]);

  const cityOf = useCallback((h: PublicHost) => h.city || h.address, []);

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

  // Unauthenticated preview: group the (already sanitized) results by city.
  const cityGroups = useMemo(() => {
    return allHosts.reduce<Record<string, number>>((acc, h) => {
      const city = cityOf(h);
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});
  }, [allHosts, cityOf]);

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

  const inCityStep = isAuthenticated && selectedCity === null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-5xl h-[80vh] max-h-[calc(100dvh-2rem)] sm:h-[78vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl"
        showCloseButton
      >
        {/* Header — gradient accent (host = violet, cohérent avec le dashboard) */}
        <DialogHeader className="relative bg-gradient-to-b from-violet-500/8 to-transparent px-6 pt-6 pb-4 shrink-0 text-start border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 ring-1 ring-violet-500/15">
              <MapPin className="size-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold tracking-tight">
                {t.search.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t.search.searchBarPlaceholder}
              </DialogDescription>
              {!isLoading && isAuthenticated && !inCityStep && (
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
              className="ps-9 h-11 rounded-xl bg-background/80 border-border/60 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 transition-colors"
            />
          </div>

          {/* Step-2 controls: change-city chip + language filter */}
          {isAuthenticated && selectedCity !== null && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={backToCities}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 ps-2.5 pe-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-500/15 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                {selectedCity === ALL_CITIES
                  ? t.search.allCities
                  : selectedCity}
                <span className="text-violet-700/60 dark:text-violet-300/60">
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
        ) : isAuthenticated ? (
          inCityStep ? (
            /* Step 1 — pick a city among those with hosts */
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-3">
                {/* Toutes les villes — featured entry */}
                <button
                  type="button"
                  onClick={() => pickCity(ALL_CITIES)}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-violet-500/25 bg-violet-500/8 p-3.5 text-start transition-colors hover:border-violet-500/45 hover:bg-violet-500/12"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 transition-transform group-hover:scale-105 dark:text-violet-300">
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
                  <ChevronRight className="size-4 shrink-0 text-violet-500/50 transition-all group-hover:translate-x-0.5 group-hover:text-violet-500" />
                </button>

                {visibleCities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleCities.map(({ city, count }) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => pickCity(city)}
                        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 text-start transition-all hover:border-violet-500/40 hover:bg-violet-500/5 hover:shadow-sm"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 transition-transform group-hover:scale-105 dark:text-violet-300">
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
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-violet-500" />
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
                      {selectedHost.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedHost.neighborhood
                        ? `${selectedHost.neighborhood}${selectedHost.city ? ` · ${selectedHost.city}` : ""}`
                        : selectedHost.city || selectedHost.address}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2 shrink-0"
                    onClick={() => setRequestHost(selectedHost)}
                  >
                    <Send className="size-4" />
                    {t.requests.sendRequest}
                  </Button>
                </div>
              )}
            </>
          )
        ) : (
          /* Unauthenticated: city list + sign-in prompt */
          <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
            <ScrollArea className="w-full sm:w-[45%] shrink-0">
              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  {t.search.availableCities}
                </p>
                <div className="space-y-1">
                  {Object.entries(cityGroups)
                    .filter(([city]) =>
                      city
                        .toLowerCase()
                        .includes(searchQuery.trim().toLowerCase()),
                    )
                    .sort((a, b) => b[1] - a[1])
                    .map(([city, count]) => (
                      <div
                        key={city}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-violet-500/5 border border-transparent hover:border-violet-500/15 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className="size-3.5 text-muted-foreground group-hover:text-violet-500 shrink-0 transition-colors" />
                          <span className="text-sm font-medium truncate">
                            {city}
                          </span>
                        </div>
                        <span className="shrink-0 ms-2 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-violet-500/10 text-violet-700 border-violet-500/15 dark:text-violet-300 tabular-nums">
                          <Users className="size-3" />
                          {count}
                        </span>
                      </div>
                    ))}
                  {Object.keys(cityGroups).length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-12 px-4 gap-3 text-muted-foreground">
                      <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                        <SearchX className="size-5" />
                      </div>
                      <p className="text-sm">{t.search.noResults}</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <Separator orientation="vertical" className="hidden sm:block" />

            {/* Sign-in prompt */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5 text-center bg-gradient-to-br from-violet-500/5 to-transparent">
              <div className="size-14 rounded-2xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/15">
                <Lock className="size-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="space-y-1.5 max-w-[240px]">
                <p className="font-semibold text-sm text-foreground">
                  {t.search.signInToSeeHosts}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.search.signInDesc}
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-[200px]">
                <Button
                  asChild
                  size="sm"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/login">{t.search.signIn}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/sign-up">{t.nav.signup}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {requestHost && (
        <RequestDialog
          open={!!requestHost}
          onOpenChange={(o) => !o && setRequestHost(null)}
          hostId={requestHost._id}
          hostName={requestHost.name}
        />
      )}
    </Dialog>
  );
}
