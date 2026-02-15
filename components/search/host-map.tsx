"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PublicHost } from "./host-list-card";

// Fix default marker icon issue with webpack/Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [49, 49],
  className: "selected-marker",
});

interface HostMapProps {
  hosts: PublicHost[];
  coords: Record<string, { lat: number; lng: number } | null>;
  selectedHost: PublicHost | null;
  onSelectHost: (host: PublicHost) => void;
}

export function HostMap({
  hosts,
  coords,
  selectedHost,
  onSelectHost,
}: HostMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Default center: Israel
    mapRef.current = L.map(containerRef.current, {
      center: [31.5, 34.8],
      zoom: 8,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when coords change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const bounds: L.LatLngExpression[] = [];

    hosts.forEach((host) => {
      const c = coords[host.address];
      if (!c) return;

      const isSelected = selectedHost?._id === host._id;
      const marker = L.marker([c.lat, c.lng], {
        icon: isSelected ? selectedIcon : defaultIcon,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: sans-serif; min-width: 120px;">
            <strong style="font-size: 13px;">${host.name}</strong>
            <br/>
            <span style="font-size: 11px; color: #666;">${host.address}</span>
            <br/>
            <span style="font-size: 11px; color: #888;">${host.kashrut} | ${host.sector}</span>
          </div>`,
        );

      marker.on("click", () => onSelectHost(host));
      markersRef.current[host._id] = marker;
      bounds.push([c.lat, c.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30], maxZoom: 14 });
    }
  }, [hosts, coords, selectedHost, onSelectHost]);

  // Fly to selected host
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedHost) return;

    const c = coords[selectedHost.address];
    if (!c) return;

    map.flyTo([c.lat, c.lng], 14, { duration: 0.8 });

    const marker = markersRef.current[selectedHost._id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedHost, coords]);

  return (
    <div
      ref={containerRef}
      className="size-full rounded-lg overflow-hidden"
      style={{ minHeight: 300 }}
    />
  );
}
