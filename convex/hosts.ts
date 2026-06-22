import { mutation, query, type QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { HostFields } from "./validators/host";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { attachUsers } from "./helpers/attachUsers";

export const getAllHosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Exclude the viewer's own host entry from the members list.
    const hosts = (await ctx.db.query("hosts").collect()).filter(
      (h) => h.authUserId !== identity.subject,
    );
    return attachUsers(ctx, hosts);
  },
});

export const createHost = mutation({
  args: {
    data: v.object(HostFields),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

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
    if (!identity) throw new ConvexError({ code: "unauthorized" });

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
  street?: string;
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
  // The first segment is the street. We surface it without the house number for
  // privacy — guests see the street and city, never the exact door.
  const street =
    parts.length >= 2
      ? parts[0]
          .replace(/\d+/g, " ")
          .replace(/\s{2,}/g, " ")
          .trim() || undefined
      : undefined;

  return { city, neighborhood, street };
}

// Max public hosts returned when no search query is provided (bounds the map view).
const PUBLIC_HOSTS_LIMIT = 200;
// Max results returned for a full-text search query.
const SEARCH_RESULTS_LIMIT = 50;

type HostDoc = Doc<"hosts">;

// A host is listed unless they've switched themselves off. A return date
// (`unavailableUntil`) auto-restores them once it's passed.
function isHostAvailable(host: HostDoc) {
  if (host.isAvailable !== false) return true;
  return host.unavailableUntil != null && host.unavailableUntil <= Date.now();
}

async function toPublicHost(ctx: QueryCtx, host: HostDoc, redact: boolean) {
  const { city, neighborhood, street } = extractLocation(host.address);

  // Traits + map pin are public; identity and precise location are not.
  const base = {
    _id: host._id,
    city,
    lat: host.lat,
    lng: host.lng,
    sector: host.sector,
    ethnicity: host.ethnicity,
    kashrout: host.kashrout,
    hasDisabilityAccess: host.hasDisabilityAccess,
    likesSinging: host.likesSinging ?? false,
    likesDivreiTorah: host.likesDivreiTorah ?? false,
    languages: host.languages ?? [],
  };

  // Signed-out visitors get an anonymized teaser: no name/photo, no address
  // beyond the city. This is enforced here (server-side) so the data never
  // leaves the backend, not just hidden in the UI.
  if (redact) {
    return {
      ...base,
      name: undefined as string | undefined,
      image: undefined as string | undefined,
      address: undefined as string | undefined,
      neighborhood: undefined as string | undefined,
      street: undefined as string | undefined,
    };
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", host.authUserId))
    .first();

  return {
    ...base,
    name: (user?.name ?? "Host") as string | undefined,
    image: user?.image as string | undefined,
    address: host.address as string | undefined,
    neighborhood,
    street,
  };
}

// Public, sanitized host list for the search dialog / map.
// When `query` is provided, results are narrowed server-side via the
// `search_address` full-text index instead of shipping the whole table.
export const searchPublicHosts = query({
  args: { query: v.optional(v.string()) },
  handler: async (ctx, { query }) => {
    const trimmed = query?.trim();
    const identity = await ctx.auth.getUserIdentity();

    const hosts = trimmed
      ? await ctx.db
          .query("hosts")
          .withSearchIndex("search_address", (q) =>
            q.search("address", trimmed),
          )
          .take(SEARCH_RESULTS_LIMIT)
      : await ctx.db.query("hosts").take(PUBLIC_HOSTS_LIMIT);

    // Hosts who switched themselves off don't appear in the public list/map,
    // and the viewer never sees their own listing.
    const available = hosts
      .filter(isHostAvailable)
      .filter((h) => h.authUserId !== identity?.subject);
    // Full details (name + precise address) are reserved for finalized members.
    // Signed-out visitors and not-yet-registered users (role "user") get
    // anonymized records: city + traits + map pin only.
    let redact = true;
    if (identity) {
      const viewer = await ctx.db
        .query("users")
        .withIndex("by_authUserId", (q) =>
          q.eq("authUserId", identity.subject),
        )
        .first();
      redact = !viewer || viewer.role === "user";
    }
    return await Promise.all(
      available.map((host) => toPublicHost(ctx, host, redact)),
    );
  },
});

// Distinct cities where available hosts are present, with counts — powers the
// "pick a city" step in the search dialog.
export const getHostCities = query({
  args: {},
  returns: v.array(v.object({ city: v.string(), count: v.number() })),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const hosts = await ctx.db.query("hosts").take(PUBLIC_HOSTS_LIMIT);
    const counts = new Map<string, number>();
    for (const host of hosts) {
      if (!isHostAvailable(host)) continue;
      if (host.authUserId === identity?.subject) continue;
      const { city } = extractLocation(host.address);
      if (!city) continue;
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }
    return Array.from(counts, ([city, count]) => ({ city, count })).sort(
      (a, b) => b.count - a.count,
    );
  },
});

// Host toggles their own availability. Turning available back on clears any
// return date; turning off optionally schedules an automatic return.
export const setHostAvailability = mutation({
  args: {
    available: v.boolean(),
    unavailableUntil: v.optional(v.number()),
  },
  returns: v.object({ updated: v.boolean() }),
  handler: async (ctx, { available, unavailableUntil }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const host = await ctx.db
      .query("hosts")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();
    if (!host) throw new ConvexError({ code: "hostNotFound" });

    await ctx.db.patch(host._id, {
      isAvailable: available,
      unavailableUntil: available ? undefined : unavailableUntil,
    });
    return { updated: true };
  },
});

export const deleteHost = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const host = await ctx.db
      .query("hosts")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (!host) return { deleted: false };

    await ctx.db.delete(host._id);
    return { deleted: true };
  },
});
