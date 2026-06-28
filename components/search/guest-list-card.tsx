"use client";

import { MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  EthnicityBadge,
  GenderBadge,
  SectorBadge,
} from "@/components/ui/enum-badges";
import { LanguageFlag } from "@/components/ui/language-flags";
import { getLanguage } from "@/app/enums/language";
import { useT } from "@/lib/i18n/context";

// Host-facing guest record (see convex/guests.ts:searchPublicGuests). Full
// profile — only signed-in hosts ever reach this.
export interface PublicGuest {
  _id: string;
  authUserId: string;
  name?: string;
  image?: string;
  region: string;
  sector: string;
  ethnicity: string;
  gender: string;
  languages?: string[];
  dob: number;
}

interface GuestListCardProps {
  guest: PublicGuest;
  isSelected: boolean;
  onSelect: (guest: PublicGuest) => void;
}

export function GuestListCard({
  guest,
  isSelected,
  onSelect,
}: GuestListCardProps) {
  const { t } = useT();

  const langs = guest.languages?.filter((code) => getLanguage(code)) ?? [];

  return (
    <button
      type="button"
      onClick={() => onSelect(guest)}
      className={cn(
        "group w-full text-start p-3 rounded-xl border transition-all cursor-pointer",
        "hover:border-primary/40 hover:shadow-sm",
        isSelected
          ? "border-primary/50 bg-primary/5 shadow-sm ring-1 ring-primary/20"
          : "border-border/60 bg-card",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/15">
          {guest.image ? (
            <Image
              src={guest.image}
              alt={guest.name ?? ""}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : guest.name ? (
            <span className="text-sm font-bold text-primary">
              {guest.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="size-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {guest.name ?? t.search.anonymousGuest}
          </p>
          <div className="mt-1 min-w-0 leading-snug">
            <p className="flex items-center gap-1 truncate text-xs font-medium text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{guest.region}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <SectorBadge value={guest.sector} />
            <EthnicityBadge value={guest.ethnicity} />
            <GenderBadge value={guest.gender} />
          </div>
          {langs.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1 border-t border-border/50 pt-2">
              {langs.map((code) => (
                <LanguageFlag key={code} code={code} />
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
