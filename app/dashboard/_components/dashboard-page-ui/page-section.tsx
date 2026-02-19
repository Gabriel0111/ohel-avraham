import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardPageSection {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
  childrenClassName?: string;
}

export const PageSection = ({
  title,
  description,
  className,
  children,
  childrenClassName,
}: DashboardPageSection) => (
  <section
    className={cn(
      "flex flex-col gap-5 py-10 md:flex-row md:items-start border-b border-border/60 last:border-none",
      className,
    )}
  >
    <div className="md:w-1/3 lg:w-1/2 space-y-1">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs text-balance leading-relaxed">
          {description}
        </p>
      )}
    </div>
    <div className={cn("flex-1 md:w-2/3 lg:w-1/2", childrenClassName)}>
      {children}
    </div>
  </section>
);
