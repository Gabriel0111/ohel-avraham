"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { HostListCard, type PublicHost } from "./host-list-card";
import { Search, MapPin, Loader2, Users, Lock } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const HostMapGoogle = dynamic(
  () => import("./host-map-google").then((mod) => ({ default: mod.HostMapGoogle })),
  {
    ssr: false,
    loading: () => (
      <div className="size-full flex items-center justify-center bg-muted rounded-lg">
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
  const hosts = useQuery(api.hosts.getPublicHosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHost, setSelectedHost] = useState<PublicHost | null>(null);

  const isAuthenticated = currentUser !== null && currentUser !== undefined;
  const isLoading = hosts === undefined || currentUser === undefined;

  const filteredHosts = useMemo(() => {
    if (!hosts) return [];
    if (!searchQuery.trim()) return hosts as PublicHost[];
    const q = searchQuery.toLowerCase();
    return (hosts as PublicHost[]).filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.city?.toLowerCase().includes(q) ||
        h.sector.toLowerCase().includes(q) ||
        h.ethnicity.toLowerCase().includes(q) ||
        h.kashrout.toLowerCase().includes(q),
    );
  }, [hosts, searchQuery]);

  const cityGroups = useMemo(() => {
    if (!hosts) return {};
    const q = searchQuery.toLowerCase();
    const filtered = q
      ? (hosts as PublicHost[]).filter(
          (h) =>
            h.city?.toLowerCase().includes(q) ||
            h.address.toLowerCase().includes(q),
        )
      : (hosts as PublicHost[]);
    return filtered.reduce<Record<string, number>>((acc, h) => {
      const city = h.city || h.address;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});
  }, [hosts, searchQuery]);

  const handleSelectHost = useCallback((host: PublicHost) => {
    setSelectedHost((prev) => (prev?._id === host._id ? null : host));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-5xl h-[85vh] sm:h-[75vh] flex flex-col p-0 gap-0 overflow-hidden"
        showCloseButton
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <MapPin className="size-4 text-primary shrink-0" />
            {t.search.title}
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={
                isAuthenticated ? t.search.placeholder : t.search.placeholder
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </DialogHeader>

        {/* Body */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : isAuthenticated ? (
          /* Authenticated: list + Google Maps */
          <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
            <ScrollArea className="w-full sm:w-[38%] border-r border-border shrink-0">
              <div className="p-3 flex flex-col gap-2">
                {filteredHosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    {t.search.noResults}
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
            <div className="flex-1 min-h-[250px] sm:min-h-0 p-2">
              <HostMapGoogle
                hosts={filteredHosts}
                selectedHost={selectedHost}
                onSelectHost={handleSelectHost}
              />
            </div>
          </div>
        ) : (
          /* Unauthenticated: city groups + sign-in prompt */
          <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
            <ScrollArea className="w-full sm:w-1/2 border-r border-border shrink-0">
              <div className="p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t.search.availableCities}
                </p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(cityGroups)
                    .sort((a, b) => b[1] - a[1])
                    .map(([city, count]) => (
                      <div
                        key={city}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-accent/40 border border-border/50"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="size-3.5 text-primary shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate">
                            {city}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="shrink-0 ml-2 text-xs"
                        >
                          <Users className="size-3 mr-1" />
                          {count}{" "}
                          {count === 1
                            ? t.search.hostsInCity
                            : t.search.hostsInCityPlural}
                        </Badge>
                      </div>
                    ))}
                  {Object.keys(cityGroups).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      {t.search.noResults}
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Sign-in prompt */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5 text-center">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Lock className="size-7 text-primary" />
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground">
                  {t.search.signInToSeeHosts}
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {t.search.signInDesc}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                <Button asChild className="flex-1" onClick={() => onOpenChange(false)}>
                  <Link href="/auth/login">{t.search.signIn}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/auth/signup">{t.nav.signup}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
