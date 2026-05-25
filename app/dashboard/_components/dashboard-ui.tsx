import { ArrowRight, Home, Shield, User } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { RoleType } from "@/convex/enums";

interface DashboardSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const DashboardSection = ({
  title,
  description,
  action,
  children,
}: DashboardSectionProps) => (
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

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
  capitalize?: boolean;
  valueEl?: ReactNode;
}

export const InfoRow = ({ icon, label, isLast, capitalize, value, valueEl }: InfoRowProps) => (
  <div
    className={`flex items-center gap-3 py-3.5 ${!isLast ? "border-b border-border/40" : ""}`}
  >
    <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <span className="grow text-sm text-muted-foreground">{label}</span>
    {valueEl ?? (
      <span className={`text-sm font-medium text-foreground ${capitalize ? "capitalize" : ""}`}>
        {value}
      </span>
    )}
  </div>
);

interface ActionCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: ReactNode;
}

export const ActionCard = ({ title, subtitle, href, icon }: ActionCardProps) => (
  <Link
    href={href}
    className="group block p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
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
