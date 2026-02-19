import { ArrowRight, Home, Shield, User } from "lucide-react";
import Link from "next/link";
import { RoleType } from "@/convex/enums";

export const DashboardSection = ({
  title,
  description,
  action,
  children,
}: any) => (
  <section className="flex flex-col border-b border-border py-8 md:flex-row md:gap-12">
    <div className="flex w-full justify-between md:block md:w-1/3 lg:w-1/2">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="hidden md:block text-sm text-muted-foreground text-balance max-w-sm">
          {description}
        </p>
      </div>
      {action && <div className="md:mt-4">{action}</div>}
    </div>
    <div className="w-full md:w-2/3 lg:w-1/2 mt-6 md:mt-0">{children}</div>
  </section>
);

export const InfoRow = ({ icon, label, value, isLast, capitalize }: any) => (
  <div
    className={`flex items-center py-4 ${!isLast ? "border-b border-border/50" : ""}`}
  >
    <div className="w-10 shrink-0">{icon}</div>
    <span className="grow text-sm font-medium text-foreground">{label}</span>
    <span
      className={`text-sm text-muted-foreground ${capitalize ? "capitalize" : ""}`}
    >
      {value}
    </span>
  </div>
);

export const ActionCard = ({ title, subtitle, href, icon }: any) => (
  <Link
    href={href}
    className="group block p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="grow text-left">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-tight">
          {subtitle}
        </p>
      </div>
      <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

export function getRoleBadgeVariant(role: RoleType) {
  switch (role) {
    case "admin":
      return "destructive" as const;

    case "host":
    case "guest":
    case "guest:host":
      return "secondary" as const;

    default:
      return "outline" as const;
  }
}

export function getIconForRole(role: string) {
  switch (role) {
    case "admin":
      return <Shield className="size-4" />;

    case "host":
    case "guest:host":
      return <Home className="size-4" />;

    case "guest":
      return <User className="size-4" />;

    default:
      return <User className="size-4" />;
  }
}
