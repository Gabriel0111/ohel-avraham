"use client";

import { Badge } from "@/components/ui/badge";
import { MapPin, Utensils, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PublicHost {
  _id: string;
  name: string;
  image?: string;
  address: string;
  sector: string;
  ethnicity: string;
  kashrout: string;
  hasDisabilityAccess: boolean;
}

interface HostListCardProps {
  host: PublicHost;
  isSelected: boolean;
  onSelect: (host: PublicHost) => void;
}

export function HostListCard({ host, isSelected, onSelect }: HostListCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(host)}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        "hover:border-primary/40 hover:bg-accent/50",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {host.image ? (
            <img
              src={host.image}
              alt={host.name}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {host.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm truncate">
            {host.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <p className="text-xs truncate">{host.address}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              <Utensils className="size-2.5" />
              {host.kashrout}
            </Badge>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              <Users className="size-2.5" />
              {host.sector}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {host.ethnicity}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );
}
