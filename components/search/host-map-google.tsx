"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { cn } from "@/lib/utils";
import type { PublicHost } from "./host-list-card";

interface HostMapProps {
  hosts: PublicHost[];
  selectedHost: PublicHost | null;
  onSelectHost: (host: PublicHost) => void;
}

const ISRAEL_CENTER = { lat: 31.5, lng: 34.8 };

export function HostMapGoogle({ hosts, selectedHost, onSelectHost }: HostMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={ISRAEL_CENTER}
        defaultZoom={8}
        mapId="DEMO_MAP_ID"
        className="size-full rounded-lg overflow-hidden"
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        {hosts.map((host) => {
          if (host.lat == null || host.lng == null) return null;
          const isSelected = selectedHost?._id === host._id;
          return (
            <AdvancedMarker
              key={host._id}
              position={{ lat: host.lat, lng: host.lng }}
              onClick={() => onSelectHost(host)}
              title={host.name}
            >
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-full border-2 shadow-lg cursor-pointer transition-all duration-200",
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground scale-125 shadow-primary/30"
                    : "bg-white border-primary/40 text-primary hover:scale-110 hover:border-primary",
                )}
              >
                <span className="text-xs font-bold leading-none">
                  {host.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
