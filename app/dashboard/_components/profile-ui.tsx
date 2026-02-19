export const AdminNotice = ({ role }: { role: string }) => (
  <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center bg-muted/10">
    <p className="text-sm text-muted-foreground">
      As an{" "}
      <span className="text-foreground font-semibold capitalize">{role}</span>,
      you have platform-wide access. No specific host or guest profiles are
      needed.
    </p>
  </div>
);
