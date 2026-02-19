import { Badge } from "@/components/ui/badge";

export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-red-500/10 text-red-600 border-red-500/20",
    host: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    rabbi: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    guest: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  const currentStyle =
    styles[role] || "bg-gray-500/10 text-gray-600 border-gray-500/20";

  return (
    <Badge
      variant="outline"
      className={`px-1.5 py-0 text-[9px] uppercase tracking-tighter font-bold border ${currentStyle}`}
    >
      {role.replace("guest:host", "Dual")}
    </Badge>
  );
}
