/**
 * The avatar ring tracks the user's role — the same mapping as
 * `role-badge.tsx`'s `ROLE_COLORS`, so the ring and the badge always agree:
 * admin = red, host/guest:host = primary, guest = amber, unset/incomplete
 * = slate. The separate pulsing "!" badge (see `isRegistrationIncomplete`)
 * still covers the "registration unfinished" case on top of the slate ring.
 *
 * Class names are written as full literals so the Tailwind JIT keeps them.
 */

export interface AccountStatusInput {
  role?: string | null;
  isVerified?: boolean | null;
  isBlocked?: boolean | null;
}

/** A user whose registration is not finished (no role beyond the default). */
export function isRegistrationIncomplete(role?: string | null): boolean {
  return !role || role === "user";
}

// Mirrors role-badge.tsx's ROLE_COLORS: host's "sky" is the primary brand
// token (bg-primary/10 text-primary), not literal sky-blue.
const ROLE_RING: Record<string, string> = {
  admin: "ring-red-500/60",
  host: "ring-primary/60",
  "guest:host": "ring-primary/60",
  guest: "ring-amber-500/70",
};

/** Tailwind ring-color class for the given account's role. */
export function getStatusRingClass({ role }: AccountStatusInput): string {
  return ROLE_RING[role ?? ""] ?? "ring-slate-400/50";
}
