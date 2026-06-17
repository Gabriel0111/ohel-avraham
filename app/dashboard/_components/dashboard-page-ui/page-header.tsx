import { ReactNode } from "react";

interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  action,
}: DashboardPageHeaderProps) => (
  <div className="mb-8 flex items-start justify-between gap-4">
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground text-pretty">{subtitle}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
