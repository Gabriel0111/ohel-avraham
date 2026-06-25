"use client";

import { EnumPill, genderColor } from "@/components/ui/enum-pill";
import { useEnumLabel } from "@/lib/i18n/context";

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
