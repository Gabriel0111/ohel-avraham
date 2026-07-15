"use client";

import { EnumPill, genderColor } from "@/components/ui/enum-pill";
import { useEnumLabel } from "@/lib/i18n/context";
import { LANGUAGE_META } from "@/lib/i18n/lang";
import type { Language } from "@/lib/i18n/translations";

/**
 * Centralized enum badges. The colour for each enum is defined once here so the
 * whole site stays consistent:
 *   Sector = amber · Ethnicity = green · Kashrout = blue · Gender = per value.
 * Each badge resolves its own localized label via `useEnumLabel`, so callers
 * pass only the raw enum value.
 */

export function SectorBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const el = useEnumLabel();
  return (
    <EnumPill color="amber" className={className}>
      {el.sector(value)}
    </EnumPill>
  );
}

export function EthnicityBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const el = useEnumLabel();
  return (
    <EnumPill color="green" className={className}>
      {el.ethnicity(value)}
    </EnumPill>
  );
}

export function KashroutBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const el = useEnumLabel();
  return (
    <EnumPill color="blue" className={className}>
      {el.kashrout(value)}
    </EnumPill>
  );
}

export function GenderBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const el = useEnumLabel();
  return (
    <EnumPill color={genderColor(value)} className={className}>
      {el.gender(value)}
    </EnumPill>
  );
}

/** The account's UI language (admin tables only) — not translated, same
 * convention as the nav switcher: each language names itself. Dash for
 * accounts created before this field existed. */
export function InterfaceLanguageBadge({
  value,
  className,
}: {
  value?: Language | null;
  className?: string;
}) {
  if (!value) {
    return <span className="text-xs text-muted-foreground/40">—</span>;
  }
  const meta = LANGUAGE_META[value];
  return (
    <EnumPill color="slate" className={className}>
      <span aria-hidden>{meta.flag}</span> {meta.label}
    </EnumPill>
  );
}
