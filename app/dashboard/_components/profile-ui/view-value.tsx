import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type ViewValueProps = {
  value: ReactNode;
} & (
  | { icon: ReactNode; title?: never } // Si icon est présent, title doit être absent
  | { title: string; icon?: never } // Si title est présent, icon doit être absent
  | { title?: never; icon?: never } // Si title est présent, icon doit être absent
);

// An empty field reads as a muted em-dash rather than blank space, so a missing
// value is clearly "nothing here" instead of a layout gap.
const EmptyDash = () => (
  <span className="text-muted-foreground/50 select-none">—</span>
);

export const ViewValue = ({ value, icon, title }: ViewValueProps) => {
  const isEmpty = value === null || value === undefined || value === "";
  const display = isEmpty ? <EmptyDash /> : value;

  if (icon)
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground/60">{icon}</span>
        {display}
      </div>
    );

  return (
    <div className="flex items-center justify-between">
      {title && <Label>{title}</Label>}
      <span className="text-muted-foreground text-sm">{display}</span>
    </div>
  );
};
