import { ReactNode } from "react";

interface SettingsRowProps {
  label: string;
  description?: string;
  children: ReactNode;
}

export const SettingsRow = ({
  label,
  description,
  children,
}: SettingsRowProps) => (
  <div className="flex flex-col gap-3 py-6 md:flex-row md:items-start border-b border-border/50 last:border-none">
    <div className="md:w-1/3 lg:w-1/2 space-y-1">
      <h4 className="text-sm font-medium text-foreground">{label}</h4>
      {description && (
        <p className="text-xs text-muted-foreground max-w-62.5">
          {description}
        </p>
      )}
    </div>
    <div className="flex-1 md:w-2/3 lg:w-1/2 w-full flex items-center">
      {children}
    </div>
  </div>
);
