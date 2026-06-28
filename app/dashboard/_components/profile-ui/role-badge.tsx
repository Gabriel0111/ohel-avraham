"use client";

import { EnumPill, type PillColor } from "@/components/ui/enum-pill";
import { useT } from "@/lib/i18n/context";

const ROLE_COLORS: Record<string, PillColor> = {
  admin: "red",
  host: "sky",
  "guest:host": "sky",
  guest: "amber",
};

export function RoleBadge({ role }: { role: string }) {
  const { t } = useT();

  const roleLabels: Record<string, string> = {
    admin: t.roles.admin,
    host: t.roles.host,
    guest: t.roles.guest,
    "guest:host": t.roles.dual,
    user: t.roles.user,
  };

  return (
    <EnumPill color={ROLE_COLORS[role] ?? "slate"}>
      {roleLabels[role] ?? role}
    </EnumPill>
  );
}
