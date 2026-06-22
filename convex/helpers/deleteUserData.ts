import type { MutationCtx } from "../_generated/server";

/**
 * Deletes all *application* data owned by an auth user:
 *  - their `hosts` and `guests` profile rows,
 *  - every hosting `request` they're party to — both the ones they sent as a
 *    guest (`by_guest`) and the ones they received as a host (`by_host`),
 *  - and finally their `users` row.
 *
 * It deliberately does NOT touch the Better Auth tables (sessions / accounts /
 * user record). Callers own that step: self-deletion goes through
 * `authClient.deleteUser()` on the client (which also signs out everywhere),
 * while admin deletion uses the better-auth adapter directly.
 */
export async function deleteUserData(ctx: MutationCtx, authUserId: string) {
  const [host, guest, sentRequests, receivedRequests, user] = await Promise.all(
    [
      ctx.db
        .query("hosts")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
        .unique(),
      ctx.db
        .query("guests")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
        .unique(),
      ctx.db
        .query("requests")
        .withIndex("by_guest", (q) => q.eq("guestAuthUserId", authUserId))
        .collect(),
      ctx.db
        .query("requests")
        .withIndex("by_host", (q) => q.eq("hostAuthUserId", authUserId))
        .collect(),
      ctx.db
        .query("users")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
        .unique(),
    ],
  );

  await Promise.all([
    ...sentRequests.map((r) => ctx.db.delete(r._id)),
    ...receivedRequests.map((r) => ctx.db.delete(r._id)),
    host ? ctx.db.delete(host._id) : Promise.resolve(),
    guest ? ctx.db.delete(guest._id) : Promise.resolve(),
  ]);

  if (user) await ctx.db.delete(user._id);
}
