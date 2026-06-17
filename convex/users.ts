import { SystemRole } from "./enums";
import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api, components } from "./_generated/api";
import { canAccess } from "./helpers/canAccessRole";
import { authComponent } from "./auth";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();
  },
});

export const getUserByAuthId = internalQuery({
  args: { authUserId: v.string() },
  handler: async (ctx, { authUserId }) => {
    return ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();
  },
});

export const getFullProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (!user) return null;

    const [host, guest] = await Promise.all([
      ctx.db
        .query("hosts")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", user.authUserId))
        .unique(),
      ctx.db
        .query("guests")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", user.authUserId))
        .unique(),
    ]);

    return { user, host, guest };
  },
});

export const createUser = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);

    console.log("Auth USER!!!", authUser);

    if (!authUser) {
      throw new Error("Unauthorized");
    }

    const authUserId = authUser._id;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (existingUser) {
      return existingUser;
    }

    return await ctx.db.insert("users", {
      authUserId,
      role: "user",
      isVerified: false,
      email: authUser.email,
      name: authUser.name ?? "",
      image: authUser.image ?? "",
    });
  },
});

export const addRoleToMe = mutation({
  args: { role: SystemRole },
  handler: async (ctx, { role }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const authUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (!user) {
      const id = await ctx.db.insert("users", {
        authUserId,
        role,
        isVerified: false,
      });
      return { created: true, id };
    }

    await ctx.db.patch(user._id, { role });

    return { updated: true, userId: user._id };
  },
});

export const assignSystemRole = mutation({
  args: {
    userId: v.id("users"),
    role: SystemRole,
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(api.users.getCurrentUser);

    console.log("assignSystemRole:currentUser", currentUser);

    if (!currentUser) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const targetUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .first();

    if (!targetUser) {
      throw new Error("Target user not found");
    }

    const currentRole = currentUser.role || "user";
    const targetCurrentRole = targetUser.role || "user";

    // L'acteur doit pouvoir modifier le rôle actuel ET le nouveau rôle
    if (!canAccess(currentRole, targetCurrentRole)) {
      throw new Error(
        `Insufficient permissions: ${currentRole} cannot modify ${targetCurrentRole}`,
      );
    }

    if (!canAccess(currentRole, args.role)) {
      throw new Error(
        `Insufficient permissions: ${currentRole} cannot assign role ${args.role}`,
      );
    }

    await ctx.db.patch(targetUser._id, {
      role: args.role,
    });

    // return {
    //   success: true,
    //   userId: args.userId,
    //   roles: [args.role],
    //   modifiedBy: currentUser.id,
    // };
  },
});

export const verifyUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const caller = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (caller?.role !== "admin") throw new Error("Forbidden");

    await ctx.db.patch(userId, {
      isVerified: true,
      verifiedBy: caller.name ?? identity.subject,
      verifiedAt: Date.now(),
    });
    return { success: true };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { name, storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const updates: { name?: string; image?: string } = {};
    if (name !== undefined) updates.name = name;
    if (storageId !== undefined) {
      const url = await ctx.storage.getUrl(storageId);
      if (url) updates.image = url;
    }

    await ctx.db.patch(user._id, updates);
  },
});

export const blockUser = mutation({
  args: { userId: v.id("users"), blocked: v.boolean() },
  handler: async (ctx, { userId, blocked }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const caller = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (caller?.role !== "admin") throw new Error("Forbidden");

    await ctx.db.patch(userId, { isBlocked: blocked });
    return { success: true };
  },
});

export const deleteUserAsAdmin = mutation({
  args: { authUserId: v.string() },
  handler: async (ctx, { authUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const caller = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (caller?.role !== "admin") throw new Error("Forbidden");

    const [targetUser, host, guest] = await Promise.all([
      ctx.db
        .query("users")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
        .unique(),
      ctx.db
        .query("hosts")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
        .unique(),
      ctx.db
        .query("guests")
        .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
        .unique(),
    ]);

    if (!targetUser) throw new Error("User not found");

    await Promise.all([
      ctx.db.delete(targetUser._id),
      host ? ctx.db.delete(host._id) : Promise.resolve(),
      guest ? ctx.db.delete(guest._id) : Promise.resolve(),
    ]);

    // Delete from Better Auth tables: sessions, accounts, and user record
    await ctx.runMutation(components.betterAuth.adapter.deleteMany, {
      input: { model: "session", where: [{ field: "userId", value: authUserId }] },
      paginationOpts: { numItems: 100, cursor: null },
    });
    await ctx.runMutation(components.betterAuth.adapter.deleteMany, {
      input: { model: "account", where: [{ field: "userId", value: authUserId }] },
      paginationOpts: { numItems: 100, cursor: null },
    });
    await ctx.runMutation(components.betterAuth.adapter.deleteOne, {
      input: { model: "user", where: [{ field: "_id", value: authUserId }] },
    });

    return { deleted: true };
  },
});

export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const authUserId = identity.subject;

    const [user, host, guest] = await Promise.all([
      ctx.db.query("users").withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId)).unique(),
      ctx.db.query("hosts").withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId)).unique(),
      ctx.db.query("guests").withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId)).unique(),
    ]);

    await Promise.all([
      user && ctx.db.delete(user._id),
      host && ctx.db.delete(host._id),
      guest && ctx.db.delete(guest._id),
    ]);

    return { deleted: true };
  },
});

export const getPeopleDashboard = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const authUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (!user) return null;

    const isAdmin = user.role === "admin";
    const isHost = user.role === "host" || user.role === "guest:host";
    const isGuest = user.role === "guest" || user.role === "guest:host";

    const [hosts, guests] = await Promise.all([
      isGuest || isAdmin
        ? ctx.db.query("hosts").collect()
        : Promise.resolve([]),
      isHost || isAdmin
        ? ctx.db.query("guests").collect()
        : Promise.resolve([]),
    ]);

    return {
      hosts,
      guests,
      permissions: { isAdmin, isHost, isGuest },
    };
  },
});
