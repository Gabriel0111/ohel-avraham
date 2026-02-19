import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { GuestFields } from "./validators/guest";
import { api } from "./_generated/api";

export const getAllGuests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const guests = await ctx.db.query("guests").collect();

    return await Promise.all(
      guests.map(async (guest) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_authUserId", (q) =>
            q.eq("authUserId", guest.authUserId),
          )
          .first();

        return {
          ...user!,
          ...guest,
        };
      }),
    );
  },
});

export const getMyGuest = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("guests")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();
  },
});

export const createGuest = mutation({
  args: {
    data: v.object(GuestFields),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

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
    if (!identity) throw new Error("Unauthorized");

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
    if (!identity) throw new Error("Unauthorized");

    const guest = await ctx.db
      .query("guests")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (!guest) return { deleted: false };

    await ctx.db.delete(guest._id);
    return { deleted: true };
  },
});
