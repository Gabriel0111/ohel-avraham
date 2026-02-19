"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HostListCard, type PublicHost } from "./host-list-card";
import { Search, MapPin, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";

const HostMap = dynamic(
  () => import("./host-map").then((mod) => ({ default: mod.HostMap })),
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
  const hosts = useQuery(api.hosts.getPublicHosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHost, setSelectedHost] = useState<PublicHost | null>(null);
  const [coords, setCoords] = useState<
    Record<string, { lat: number; lng: number } | null>
  >({});
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Geocode addresses when hosts change
  useEffect(() => {
    if (!hosts || hosts.length === 0 || !open) return;

    const uncachedAddresses = hosts
      .map((h) => h.address)
      .filter((addr) => !(addr in coords));

    if (uncachedAddresses.length === 0) return;

    setIsGeocoding(true);
    fetch("/api/geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: uncachedAddresses }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCoords((prev) => ({ ...prev, ...data }));
      })
      .catch(console.error)
      .finally(() => setIsGeocoding(false));
  }, [hosts, open]);

  const filteredHosts = useMemo(() => {
    if (!hosts) return [];
    if (!searchQuery.trim()) return hosts as PublicHost[];

    const q = searchQuery.toLowerCase();
    return (hosts as PublicHost[]).filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.sector.toLowerCase().includes(q) ||
        h.ethnicity.toLowerCase().includes(q) ||
        h.kashrout.toLowerCase().includes(q),
    );
  }, [hosts, searchQuery]);

  const handleSelectHost = useCallback((host: PublicHost) => {
    setSelectedHost((prev) => (prev?._id === host._id ? null : host));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-5xl h-[85vh] sm:h-[75vh] flex flex-col p-0 gap-0"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Find a Shabbat Host
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, address, sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
          {/* Host list panel */}
          <ScrollArea className="w-full sm:w-[38%] border-r border-border">
            <div className="p-4 flex flex-col gap-2">
              {!hosts && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {hosts && filteredHosts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No hosts found matching your search.
                </div>
              )}

              {filteredHosts.map((host) => (
                <HostListCard
                  key={host._id}
                  host={host}
                  isSelected={selectedHost?._id === host._id}
                  onSelect={handleSelectHost}
                />
              ))}

              {isGeocoding && (
                <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  Loading map locations...
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Map panel */}
          <div className="flex-1 min-h-[250px] sm:min-h-0 p-2">
            <HostMap
              hosts={filteredHosts}
              coords={coords}
              selectedHost={selectedHost}
              onSelectHost={handleSelectHost}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
