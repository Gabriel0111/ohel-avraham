"use client";

import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/context";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-red-500/10 text-red-600 border-red-500/20",
  host: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  rabbi: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  guest: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "guest:host": "bg-violet-500/10 text-violet-600 border-violet-500/20",
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

  const style = ROLE_STYLES[role] ?? "bg-gray-500/10 text-gray-600 border-gray-500/20";
  const label = roleLabels[role] ?? role;

  return (
    <Badge
      variant="outline"
      className={`px-1.5 py-0 text-[9px] uppercase tracking-tighter font-bold border ${style}`}
    >
      {label}
    </Badge>
  );
}
