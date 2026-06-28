/**
 * Maps a user's system role to a Tailwind ring-color class for avatar status
 * rings. Class names are written as full literals so the Tailwind JIT keeps
 * them. Mirrors the palette in `role-badge.tsx` (host/dual = brand sky,
 * guest = amber, admin = destructive).
 */
const ROLE_RING: Record<string, string> = {
  host: "ring-primary",
  "guest:host": "ring-primary",
  guest: "ring-amber-500",
  admin: "ring-destructive",
};

/** A user whose registration is not finished (no role beyond the default). */
export function isRegistrationIncomplete(role?: string | null): boolean {
  return !role || role === "user";
}

/** Tailwind ring-color class for the given role's avatar status ring. */
export function getRoleRingClass(role?: string | null): string {
  if (isRegistrationIncomplete(role)) return "ring-amber-500/70";
  return ROLE_RING[role as string] ?? "ring-border";
}
