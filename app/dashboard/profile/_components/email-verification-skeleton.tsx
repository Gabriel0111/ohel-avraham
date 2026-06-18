import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder for the email-verification card. Mirrors the card's
 * layout (icon · title/description · action button) so the real card swaps
 * in without a layout shift instead of popping in once the session and
 * linked-accounts lookups resolve.
 */
export function EmailVerificationSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border/60">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-8 w-28 rounded-md" />
    </div>
  );
}
