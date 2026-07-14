/**
 * The avatar ring is the one place a user's standing with the platform is
 * always visible, so it tracks account *status*, not role: amber while the
 * account can't yet act (registration unfinished, or awaiting an admin's
 * review), green once verified, destructive once blocked. Role is carried by
 * `role-badge.tsx` instead.
 *
 * Class names are written as full literals so the Tailwind JIT keeps them.
 */

export type AccountStatus = "blocked" | "incomplete" | "pending" | "verified";

export interface AccountStatusInput {
  role?: string | null;
  isVerified?: boolean | null;
  isBlocked?: boolean | null;
}

/** A user whose registration is not finished (no role beyond the default). */
export function isRegistrationIncomplete(role?: string | null): boolean {
  return !role || role === "user";
}

export function getAccountStatus({
  role,
  isVerified,
  isBlocked,
}: AccountStatusInput): AccountStatus {
  if (isBlocked) return "blocked";
  if (isRegistrationIncomplete(role)) return "incomplete";
  // Admins are verified by construction — the members table already reads them
  // that way, and no admin ever waits on someone else's review.
  if (isVerified || role === "admin") return "verified";
  return "pending";
}

const STATUS_RING: Record<AccountStatus, string> = {
  blocked: "ring-destructive",
  // Both amber states mean "cannot act yet"; only `incomplete` also carries the
  // pulsing "!" badge, which is what tells them apart at a glance.
  incomplete: "ring-amber-500/70",
  pending: "ring-amber-500/70",
  verified: "ring-green-500/60",
};

/** Tailwind ring-color class for the given account's avatar status ring. */
export function getStatusRingClass(user: AccountStatusInput): string {
  return STATUS_RING[getAccountStatus(user)];
}
