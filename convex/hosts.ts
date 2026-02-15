import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { HostFields } from "./validators/host";
import { api } from "./_generated/api";

export const getAllHosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const hosts = await ctx.db.query("hosts").collect();
    // const guests = await ctx.db.query("guests").collect();

    return await Promise.all(
      hosts.map(async (host) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_authUserId", (q) =>
            q.eq("authUserId", host.authUserId),
          )
          .first();

        return {
          ...user!,
          ...host,
        };
      }),
    );
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

export const getPublicHosts = query({
  args: {},
  handler: async (ctx) => {
    const hosts = await ctx.db.query("hosts").collect();

    return await Promise.all(
      hosts.map(async (host) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_authUserId", (q) =>
            q.eq("authUserId", host.authUserId),
          )
          .first();

        return {
          _id: host._id,
          name: user?.name ?? "Host",
          image: user?.image,
          address: host.address,
          sector: host.sector,
          ethnicity: host.ethnicity,
          kashrout: host.kashrout,
          hasDisabilityAccess: host.hasDisabilityAccess,
        };
      }),
    );
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
