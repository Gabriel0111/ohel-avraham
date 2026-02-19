import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type ViewValueProps = {
  value: any;
} & (
  | { icon: ReactNode; title?: never } // Si icon est présent, title doit être absent
  | { title: string; icon?: never } // Si title est présent, icon doit être absent
);

export const ViewValue = ({ value, icon, title }: ViewValueProps) => {
  if (icon)
    return (
      <div className="flex items-center gap-2 text-sm">
        {icon && <span className="text-muted-foreground/60">{icon}</span>}
        {value || <span className="italic">Not provided</span>}
      </div>
    );

  if (title) {
    return (
      <div className="flex items-center justify-between">
        <Label>{title}</Label>
        <span className="text-muted-foreground text-sm">{value}</span>
      </div>
    );
  }
};
