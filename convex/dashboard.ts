import { query } from "./_generated/server";

export const getDashboardData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (!user) return null;

    const [myHost, myGuest] = await Promise.all([
      ctx.db
        .query("hosts")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", user.authUserId))
        .unique(),
      ctx.db
        .query("guests")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", user.authUserId))
        .unique(),
    ]);

    const isHost = user.role === "host" || user.role === "guest:host";
    const isGuest = user.role === "guest" || user.role === "guest:host";

    // On renvoie un objet "clé en main" pour le frontend
    return {
      user,
      hasProfile: isHost ? !!myHost : isGuest ? !!myGuest : true,
      roleInfo: {
        isHost,
        isGuest,
        isAdmin: user.role === "admin",
      },
    };
  },
});
