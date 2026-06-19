"use client";

import { Accessibility, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { EnumPill } from "@/components/ui/enum-pill";
import { LanguageFlag } from "@/components/ui/language-flags";
import { getLanguage } from "@/app/enums/language";
import { useEnumLabel, useT } from "@/lib/i18n/context";

export interface PublicHost {
  _id: string;
  name: string;
  image?: string;
  address: string;
  city?: string;
  neighborhood?: string;
  /** Street name without the house number (privacy-safe). */
  street?: string;
  lat?: number;
  lng?: number;
  sector: string;
  ethnicity: string;
  kashrout: string;
  hasDisabilityAccess: boolean;
  languages?: string[];
}

interface HostListCardProps {
  host: PublicHost;
  isSelected: boolean;
  onSelect: (host: PublicHost) => void;
}

export function HostListCard({
  host,
  isSelected,
  onSelect,
}: HostListCardProps) {
  const el = useEnumLabel();
  const { t } = useT();

  return (
    <button
      type="button"
      onClick={() => onSelect(host)}
      className={cn(
        "group w-full text-start p-3 rounded-xl border transition-all cursor-pointer",
        "hover:border-violet-500/40 hover:shadow-sm",
        isSelected
          ? "border-violet-500/50 bg-violet-500/5 shadow-sm ring-1 ring-violet-500/20"
          : "border-border/60 bg-card",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 ring-1 ring-violet-500/15">
          {host.image ? (
            <Image
              src={host.image}
              alt={host.name}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-violet-600 dark:text-violet-300">
              {host.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {host.name}
          </p>
          <div className="flex items-start gap-1 mt-0.5 text-muted-foreground">
            <MapPin className="size-3 shrink-0 mt-0.5" />
            <div className="min-w-0">
              {host.street &&
                host.street !== host.city &&
                host.street !== host.neighborhood && (
                  <p className="text-xs font-medium text-foreground/80 truncate">
                    {host.street}
                  </p>
                )}
              <p className="text-xs truncate">
                {host.neighborhood ? (
                  <>
                    {host.neighborhood}
                    {host.city ? ` · ${host.city}` : ""}
                  </>
                ) : (
                  host.city || host.address
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <EnumPill color="violet">{el.sector(host.sector)}</EnumPill>
            <EnumPill color="blue">{el.kashrout(host.kashrout)}</EnumPill>
            <EnumPill color="slate">{el.ethnicity(host.ethnicity)}</EnumPill>
            {host.hasDisabilityAccess && (
              <EnumPill color="green" icon={Accessibility}>
                {t.people.access}
              </EnumPill>
            )}
          </div>
          {(() => {
            const langs =
              host.languages?.filter((code) => getLanguage(code)) ?? [];
            if (langs.length === 0) return null;
            return (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {t.form.languages}
                </span>
                {langs.map((code) => (
                  <LanguageFlag key={code} code={code} />
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </button>
  );
}
