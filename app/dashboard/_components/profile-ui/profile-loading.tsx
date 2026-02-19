import { Spinner } from "@/components/ui/spinner";

export const ProfileLoading = () => (
  <div className="flex flex-col items-center justify-center gap-3 text-sm">
    <Spinner className="size-8 text-primary" />
    <p className="text-muted-foreground">Loading profile data...</p>
  </div>
);
