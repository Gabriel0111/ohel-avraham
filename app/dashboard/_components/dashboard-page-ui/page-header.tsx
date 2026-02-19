interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: DashboardPageHeaderProps) => (
  <div className="mb-10 space-y-1">
    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
  </div>
);
