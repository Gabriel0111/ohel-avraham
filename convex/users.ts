import { SystemRole } from "./enums";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
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

    const currentRole = targetUser.role || "user";
    const targetCurrentRole = targetUser.role || "user";

    // // L'acteur doit pouvoir modifier le rôle actuel ET le nouveau rôle
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

    await ctx.db.patch("users", targetUser._id, {
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

export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const authUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (!user) return { deleted: false };

    await ctx.db.delete(user._id);
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
