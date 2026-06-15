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
import { useDebounce } from "use-debounce";
import { HostListCard, type PublicHost } from "./host-list-card";
import { Search, MapPin, Loader2, Users, Lock, SearchX } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { t } = useT();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHost, setSelectedHost] = useState<PublicHost | null>(null);

  // Debounce the term sent to Convex so we hit the search index per pause,
  // not per keystroke.
  const [debouncedQuery] = useDebounce(searchQuery.trim(), 250);

  // Server-side full-text search via the `search_address` index.
  const hostsResult = useQuery(api.hosts.searchPublicHosts, {
    query: debouncedQuery || undefined,
  }) as PublicHost[] | undefined;

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

  const filteredHosts = hosts ?? [];

  // Results are already narrowed server-side; just group them by city.
  const cityGroups = useMemo(() => {
    if (!hosts) return {};
    return hosts.reduce<Record<string, number>>((acc, h) => {
      const city = h.city || h.address;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});
  }, [hosts]);

  const handleSelectHost = useCallback((host: PublicHost) => {
    setSelectedHost((prev) => (prev?._id === host._id ? null : host));
  }, []);

  const resultsLabel =
    filteredHosts.length === 1
      ? t.search.hostsInCity
      : t.search.hostsInCityPlural;

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
              {!isLoading && isAuthenticated && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-semibold text-foreground tabular-nums">
                    {filteredHosts.length}
                  </span>{" "}
                  {resultsLabel}
                </p>
              )}
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-11 rounded-xl bg-background/80 border-border/60 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 transition-colors"
            />
          </div>
        </DialogHeader>

        {/* Body */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : isAuthenticated ? (
          /* Authenticated: host list + map */
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
        ) : (
          /* Unauthenticated: city list + sign-in prompt */
          <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
            <ScrollArea className="w-full sm:w-[45%] shrink-0">
              <div className="p-4 space-y-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {t.search.availableCities}
                </p>
                <div className="space-y-1">
                  {Object.entries(cityGroups)
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
    </Dialog>
  );
}
