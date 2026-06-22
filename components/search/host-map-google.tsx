"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicHost } from "./host-list-card";
import { env } from "@/lib/env";

interface HostMapProps {
  hosts: PublicHost[];
  selectedHost: PublicHost | null;
  onSelectHost: (host: PublicHost) => void;
}

const ISRAEL_CENTER = { lat: 31.5, lng: 34.8 };
// Padding (px) kept around the markers when fitting bounds.
const FIT_PADDING = 56;
// Privacy: never let the map zoom past neighbourhood level, so a guest can see
// roughly where a host is without pinpointing the building. This is the hard
// cap applied to the map itself (manual zoom included).
const PRIVACY_MAX_ZOOM = 15;
// Don't zoom in further than this when results are tightly clustered.
const MAX_FIT_ZOOM = 14;
// Zoom used to focus a single selected host (kept at/under the privacy cap).
const FOCUS_ZOOM = 15;

// Keeps the viewport framed on the current results: fits all markers into view
// when the host list changes, and pans/zooms onto a host when one is selected.
function MapViewController({
  hosts,
  selectedHost,
}: {
  hosts: PublicHost[];
  selectedHost: PublicHost | null;
}) {
  const map = useMap();

  // Build a stable key from the host coordinates so the fit only re-runs when
  // the actual set of points changes (not on every render).
  const pointsKey = hosts
    .filter((h) => h.lat != null && h.lng != null)
    .map((h) => `${h.lat},${h.lng}`)
    .join("|");

  useEffect(() => {
    if (!map) return;

    const points = hosts.filter(
      (h): h is PublicHost & { lat: number; lng: number } =>
        h.lat != null && h.lng != null,
    );

    if (points.length === 0) {
      map.setCenter(ISRAEL_CENTER);
      map.setZoom(9);
      return;
    }

    if (points.length === 1) {
      map.setCenter({ lat: points[0].lat, lng: points[0].lng });
      map.setZoom(MAX_FIT_ZOOM);
      return;
    }

    // Build literal bounds (north/south/east/west) from the points so we don't
    // depend on the `google.maps` global type being in scope.
    const bounds = points.reduce(
      (acc, p) => ({
        north: Math.max(acc.north, p.lat),
        south: Math.min(acc.south, p.lat),
        east: Math.max(acc.east, p.lng),
        west: Math.min(acc.west, p.lng),
      }),
      {
        north: points[0].lat,
        south: points[0].lat,
        east: points[0].lng,
        west: points[0].lng,
      },
    );
    map.fitBounds(bounds, FIT_PADDING);

    // Cap the zoom so a tight cluster doesn't blow up to street level.
    const listener = map.addListener("idle", () => {
      const zoom = map.getZoom();
      if (zoom != null && zoom > MAX_FIT_ZOOM) map.setZoom(MAX_FIT_ZOOM);
      listener.remove();
    });
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, pointsKey]);

  // Focus the selected host without changing the framing of the whole set.
  useEffect(() => {
    if (!map || !selectedHost || selectedHost.lat == null || selectedHost.lng == null)
      return;
    map.panTo({ lat: selectedHost.lat, lng: selectedHost.lng });
    if ((map.getZoom() ?? 0) < FOCUS_ZOOM) map.setZoom(FOCUS_ZOOM);
  }, [map, selectedHost]);

  return null;
}

export function HostMapGoogle({
  hosts,
  selectedHost,
  onSelectHost,
}: HostMapProps) {
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={ISRAEL_CENTER}
        defaultZoom={9}
        maxZoom={PRIVACY_MAX_ZOOM}
        mapId="DEMO_MAP_ID"
        className="size-full rounded-lg overflow-hidden"
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        <MapViewController hosts={hosts} selectedHost={selectedHost} />
        {hosts.map((host) => {
          if (host.lat == null || host.lng == null) return null;
          const isSelected = selectedHost?._id === host._id;
          const showPhoto = isSelected && !!host.image;
          return (
            <AdvancedMarker
              key={host._id}
              position={{ lat: host.lat, lng: host.lng }}
              onClick={() => onSelectHost(host)}
              title={host.name ?? undefined}
            >
              <div
                className={cn(
                  "flex items-center justify-center overflow-hidden rounded-full border-2 shadow-lg cursor-pointer transition-all duration-200",
                  showPhoto
                    ? "size-12 border-primary shadow-primary/30"
                    : isSelected
                      ? "size-8 bg-primary border-primary text-primary-foreground scale-125 shadow-primary/30"
                      : "size-8 bg-white border-primary/40 text-primary hover:scale-110 hover:border-primary",
                )}
              >
                {showPhoto ? (
                  <Image
                    src={host.image!}
                    alt={host.name ?? ""}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                ) : host.name ? (
                  <span className="text-xs font-bold leading-none">
                    {host.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="size-4" />
                )}
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
