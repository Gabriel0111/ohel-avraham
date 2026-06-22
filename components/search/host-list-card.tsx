"use client";

import { Accessibility, BookOpen, Music, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { EnumPill } from "@/components/ui/enum-pill";
import { LanguageFlag } from "@/components/ui/language-flags";
import { PreferenceBadge } from "@/components/ui/preference-toggle";
import { getLanguage } from "@/app/enums/language";
import { useEnumLabel, useT } from "@/lib/i18n/context";

export interface PublicHost {
  _id: string;
  /** Hidden (undefined) for signed-out viewers — anonymized teaser. */
  name?: string;
  image?: string;
  /** Hidden (undefined) for signed-out viewers — only `city` is exposed. */
  address?: string;
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
  likesSinging?: boolean;
  likesDivreiTorah?: boolean;
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

  // Privacy-safe wayfinding: a primary line (street when distinct) over a
  // secondary locality line (neighbourhood · city). Falls back gracefully when
  // only a city or the raw address is available.
  const street =
    host.street && host.street !== host.city && host.street !== host.neighborhood
      ? host.street
      : undefined;
  const locality = host.neighborhood
    ? `${host.neighborhood}${host.city ? ` · ${host.city}` : ""}`
    : host.city || host.address;
  const primaryLine = street ?? locality;
  const secondaryLine = street ? locality : undefined;

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
              alt={host.name ?? ""}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : host.name ? (
            <span className="text-sm font-bold text-violet-600 dark:text-violet-300">
              {host.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="size-5 text-violet-600 dark:text-violet-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {host.name ?? t.search.anonymousHost}
          </p>
          <div className="mt-1 min-w-0 leading-snug">
            <p
              className={cn(
                "text-xs font-medium text-foreground",
                secondaryLine ? "truncate" : "line-clamp-2",
              )}
            >
              {primaryLine}
            </p>
            {secondaryLine && (
              <p className="truncate text-[11px] text-muted-foreground">
                {secondaryLine}
              </p>
            )}
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
            const hasPrefs = host.likesSinging || host.likesDivreiTorah;
            if (langs.length === 0 && !hasPrefs) return null;
            return (
              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/50 pt-2">
                {langs.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1">
                    {langs.map((code) => (
                      <LanguageFlag key={code} code={code} />
                    ))}
                  </div>
                ) : (
                  <span aria-hidden />
                )}
                {hasPrefs && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    {host.likesSinging && (
                      <PreferenceBadge
                        icon={Music}
                        label={t.form.likesSinging}
                        color="rose"
                      />
                    )}
                    {host.likesDivreiTorah && (
                      <PreferenceBadge
                        icon={BookOpen}
                        label={t.form.likesDivreiTorah}
                        color="blue"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </button>
  );
}
