import { mutation, query, type QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import {
  GuestFields,
  SectorV,
  EthnicityV,
  GenderV,
  LanguageV,
} from "./validators/guest";
import { api } from "./_generated/api";
import { attachUsers } from "./helpers/attachUsers";
import type { Doc } from "./_generated/dataModel";

// Bounds the guest list shipped to hosts for search (mirrors PUBLIC_HOSTS_LIMIT).
const PUBLIC_GUESTS_LIMIT = 200;

// Only hosts (and admins) may browse guests. A guest:host counts as a host.
// Note: we can't reuse `canAccess` here — it puts guest and host at the same
// level, so it wouldn't tell them apart.
async function viewerIsHost(ctx: QueryCtx, authUserId: string) {
  const viewer = await ctx.db
    .query("users")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
    .first();
  return (
    viewer?.role === "host" ||
    viewer?.role === "guest:host" ||
    viewer?.role === "admin"
  );
}

// Public guest shape for the host-side search list. Full profile (name + photo)
// is shown to any signed-in host — guests opted in to be found, and only hosts
// reach this query.
async function enrichGuests(ctx: QueryCtx, guests: Doc<"guests">[]) {
  const users = await ctx.db.query("users").collect();
  const byAuthId = new Map(users.map((u) => [u.authUserId, u]));
  return guests.map((g) => {
    const user = byAuthId.get(g.authUserId);
    return {
      _id: g._id,
      authUserId: g.authUserId,
      name: user?.name,
      image: user?.image,
      region: g.region,
      sector: g.sector,
      ethnicity: g.ethnicity,
      gender: g.gender,
      languages: g.languages ?? [],
      dob: g.dob,
    };
  });
}

export const getAllGuests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Exclude the viewer's own guest entry from the members list.
    const guests = (await ctx.db.query("guests").collect()).filter(
      (g) => g.authUserId !== identity.subject,
    );
    return attachUsers(ctx, guests);
  },
});

export const createGuest = mutation({
  args: {
    data: v.object(GuestFields),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const authUserId = identity.subject;

    const id = await ctx.db.insert("guests", {
      authUserId,
      ...args.data,
    });

    await ctx.runMutation(api.users.addRoleToMe, { role: "guest" });

    return { success: true, id };
  },
});

export const upsertGuest = mutation({
  args: {
    data: v.object(GuestFields),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const authUserId = identity.subject;

    const existing = await ctx.db
      .query("guests")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args.data);
      return { updated: true };
    }

    const id = await ctx.db.insert("guests", {
      authUserId,
      ...args.data,
    });

    return { created: true, id };
  },
});

export const deleteGuest = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const guest = await ctx.db
      .query("guests")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (!guest) return { deleted: false };

    await ctx.db.delete(guest._id);
    return { deleted: true };
  },
});

// Public, host-facing guest list for the search dialog (host → guest mode).
// Returns the whole available set (bounded); the dialog narrows by region,
// criteria and free-text client-side, exactly like the host search.
export const searchPublicGuests = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("guests"),
      authUserId: v.string(),
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      region: v.string(),
      sector: SectorV,
      ethnicity: EthnicityV,
      gender: GenderV,
      languages: v.array(LanguageV),
      dob: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    if (!(await viewerIsHost(ctx, identity.subject))) return [];

    const guests = (await ctx.db.query("guests").take(PUBLIC_GUESTS_LIMIT)).filter(
      (g) => g.authUserId !== identity.subject,
    );
    return enrichGuests(ctx, guests);
  },
});

// Distinct regions where guests are present, with counts — powers the
// "pick a region" step (mirror of hosts.getHostCities).
export const getGuestRegions = query({
  args: {},
  returns: v.array(v.object({ region: v.string(), count: v.number() })),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    if (!(await viewerIsHost(ctx, identity.subject))) return [];

    const guests = await ctx.db.query("guests").take(PUBLIC_GUESTS_LIMIT);
    const counts = new Map<string, number>();
    for (const g of guests) {
      if (g.authUserId === identity.subject) continue;
      const region = g.region?.trim();
      if (!region) continue;
      counts.set(region, (counts.get(region) ?? 0) + 1);
    }
    return Array.from(counts, ([region, count]) => ({ region, count })).sort(
      (a, b) => b.count - a.count,
    );
  },
});
