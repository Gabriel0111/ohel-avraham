import { mutation, query, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { HostFields } from "./validators/host";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

export const getAllHosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const hosts = await ctx.db.query("hosts").collect();
    // const guests = await ctx.db.query("guests").collect();

    const results = await Promise.all(
      hosts.map(async (host) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_authUserId", (q) =>
            q.eq("authUserId", host.authUserId),
          )
          .first();

        if (!user) return null;

        return {
          ...host,
          userId: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          isVerified: user.isVerified,
          isBlocked: user.isBlocked ?? false,
          verifiedBy: user.verifiedBy,
          verifiedAt: user.verifiedAt,
        };
      }),
    );
    return results.filter((r) => r !== null);
  },
});

export const createHost = mutation({
  args: {
    data: v.object(HostFields),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const authUserId = identity.subject;

    const id = await ctx.db.insert("hosts", {
      authUserId,
      ...args.data,
    });

    await ctx.runMutation(api.users.addRoleToMe, { role: "host" });

    return { success: true, id };
  },
});

export const upsertHost = mutation({
  args: {
    data: v.object(HostFields),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const authUserId = identity.subject;

    const existing = await ctx.db
      .query("hosts")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args.data);
      return { updated: true };
    }

    const id = await ctx.db.insert("hosts", {
      authUserId,
      ...args.data,
    });

    return { created: true, id };
  },
});

// Parse a Google `formattedAddress` into city + neighborhood.
// Format is typically: "<street> <number>, [neighborhood,] <city>[, postal], <country>"
function extractLocation(address: string): {
  city: string;
  neighborhood?: string;
} {
  let parts = address
    .split(", ")
    .map((p) => p.trim())
    .filter(Boolean)
    // Drop pure-numeric postal codes.
    .filter((p) => !/^\d[\d\s-]*$/.test(p));

  if (parts.length === 0) return { city: address };

  // The last segment of a Google formatted address is the country — drop it
  // generically so we never surface it as a city (handles "Israel", "Israël",
  // "ישראל", etc.). Keep it only if it's the sole segment.
  if (parts.length > 1) parts = parts.slice(0, -1);

  const city = parts[parts.length - 1];
  // The segment just before the city (when there's also a street part) is the neighborhood.
  const neighborhood = parts.length >= 3 ? parts[parts.length - 2] : undefined;

  return { city, neighborhood };
}

// Max public hosts returned when no search query is provided (bounds the map view).
const PUBLIC_HOSTS_LIMIT = 200;
// Max results returned for a full-text search query.
const SEARCH_RESULTS_LIMIT = 50;

type HostDoc = Doc<"hosts">;

async function toPublicHost(ctx: QueryCtx, host: HostDoc) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", host.authUserId))
    .first();

  const { city, neighborhood } = extractLocation(host.address);

  return {
    _id: host._id,
    name: user?.name ?? "Host",
    image: user?.image,
    address: host.address,
    city,
    neighborhood,
    lat: host.lat,
    lng: host.lng,
    sector: host.sector,
    ethnicity: host.ethnicity,
    kashrout: host.kashrout,
    hasDisabilityAccess: host.hasDisabilityAccess,
  };
}

// Public, sanitized host list for the search dialog / map.
// When `query` is provided, results are narrowed server-side via the
// `search_address` full-text index instead of shipping the whole table.
export const searchPublicHosts = query({
  args: { query: v.optional(v.string()) },
  handler: async (ctx, { query }) => {
    const trimmed = query?.trim();

    const hosts = trimmed
      ? await ctx.db
          .query("hosts")
          .withSearchIndex("search_address", (q) =>
            q.search("address", trimmed),
          )
          .take(SEARCH_RESULTS_LIMIT)
      : await ctx.db.query("hosts").take(PUBLIC_HOSTS_LIMIT);

    return await Promise.all(hosts.map((host) => toPublicHost(ctx, host)));
  },
});

export const getMyHost = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("hosts")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();
  },
});

export const deleteHost = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const host = await ctx.db
      .query("hosts")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (!host) return { deleted: false };

    await ctx.db.delete(host._id);
    return { deleted: true };
  },
});
