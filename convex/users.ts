import { SystemRole } from "./enums";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api, components } from "./_generated/api";
import { canAccess } from "./helpers/canAccessRole";
import { authComponent } from "./auth";
import { deleteUserData } from "./helpers/deleteUserData";
import { HostFields } from "./validators/host";
import { GuestFields } from "./validators/guest";

// ─── Document validators (used for `returns:`) ────────────────────────────────
// These must mirror the schema exactly — `returns` validators are enforced at
// runtime, so any drift throws a ReturnsValidationError on otherwise-working
// queries. Keep in sync with convex/schema.ts.

const UserDoc = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  authUserId: v.string(),
  role: SystemRole,
  isVerified: v.boolean(),
  isBlocked: v.optional(v.boolean()),
  verifiedBy: v.optional(v.string()),
  verifiedAt: v.optional(v.number()),
  email: v.optional(v.string()),
  name: v.optional(v.string()),
  image: v.optional(v.string()),
});

const HostDoc = v.object({
  _id: v.id("hosts"),
  _creationTime: v.number(),
  authUserId: v.string(),
  ...HostFields,
});

const GuestDoc = v.object({
  _id: v.id("guests"),
  _creationTime: v.number(),
  authUserId: v.string(),
  ...GuestFields,
});

export const getCurrentUser = query({
  args: {},
  returns: v.union(UserDoc, v.null()),
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
  returns: v.union(
    v.object({
      user: UserDoc,
      host: v.union(HostDoc, v.null()),
      guest: v.union(GuestDoc, v.null()),
    }),
    v.null(),
  ),
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
  returns: v.null(),
  handler: async (ctx) => {
    // Guard against the JWT-refresh race: the client may think it is
    // authenticated while the token is momentarily invalid on the server.
    // In that case bail out quietly instead of erroring.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // `identity.subject` equals the Better Auth user id (the stored authUserId).
    const authUserId = identity.subject;

    // Prefer the full Better Auth user (it carries the avatar `image`), but
    // `getAuthUser` can throw "Unauthenticated" during a token-refresh window
    // even when the identity itself is valid. Fall back to the JWT claims so
    // sign-up still creates the record instead of leaving the user with none.
    // The convex plugin's token omits `image`, so the avatar is best-effort here.
    let email: string | undefined;
    let name: string | undefined;
    let image: string | undefined;
    try {
      const authUser = await authComponent.getAuthUser(ctx);
      email = authUser?.email;
      name = authUser?.name ?? undefined;
      image = authUser?.image ?? undefined;
    } catch {
      email = identity.email;
      name = identity.name;
      image = (identity.pictureUrl as string | undefined) ?? undefined;
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (existingUser) {
      return null;
    }

    await ctx.db.insert("users", {
      authUserId,
      role: "user",
      isVerified: false,
      email,
      name: name ?? "",
      image: image ?? "",
    });
    return null;
  },
});

export const addRoleToMe = mutation({
  args: { role: SystemRole },
  returns: v.union(
    v.object({ created: v.boolean(), id: v.id("users") }),
    v.object({ updated: v.boolean(), userId: v.id("users") }),
  ),
  handler: async (ctx, { role }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });
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
  returns: v.null(),
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(api.users.getCurrentUser);

    if (!currentUser) {
      throw new ConvexError({ code: "unauthorized" });
    }

    const targetUser = await ctx.db.get(args.userId);

    if (!targetUser) {
      throw new ConvexError({ code: "userNotFound" });
    }

    const currentRole = currentUser.role || "user";
    const targetCurrentRole = targetUser.role || "user";

    // L'acteur doit pouvoir modifier le rôle actuel ET le nouveau rôle
    if (!canAccess(currentRole, targetCurrentRole)) {
      throw new ConvexError({ code: "forbidden" });
    }

    if (!canAccess(currentRole, args.role)) {
      throw new ConvexError({ code: "forbidden" });
    }

    await ctx.db.patch(targetUser._id, {
      role: args.role,
    });

    return null;
  },
});

export const verifyUser = mutation({
  args: { userId: v.id("users") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, { userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const caller = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (caller?.role !== "admin") throw new ConvexError({ code: "forbidden" });

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
  returns: v.string(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
  },
  returns: v.null(),
  handler: async (ctx, { name, storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (!user) throw new ConvexError({ code: "userNotFound" });

    const updates: { name?: string; image?: string } = {};
    if (name !== undefined) updates.name = name;
    if (storageId !== undefined) {
      const url = await ctx.storage.getUrl(storageId);
      if (url) updates.image = url;
    }

    await ctx.db.patch(user._id, updates);
    return null;
  },
});

export const blockUser = mutation({
  args: { userId: v.id("users"), blocked: v.boolean() },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, { userId, blocked }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const caller = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (caller?.role !== "admin") throw new ConvexError({ code: "forbidden" });

    await ctx.db.patch(userId, { isBlocked: blocked });
    return { success: true };
  },
});

export const deleteUserAsAdmin = mutation({
  args: { authUserId: v.string() },
  returns: v.object({ deleted: v.boolean() }),
  handler: async (ctx, { authUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    const caller = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", identity.subject))
      .unique();

    if (caller?.role !== "admin") throw new ConvexError({ code: "forbidden" });

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (!targetUser) throw new ConvexError({ code: "userNotFound" });

    // Remove all app data (profiles + every hosting request, sent or received).
    await deleteUserData(ctx, authUserId);

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
  returns: v.object({ deleted: v.boolean() }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "unauthorized" });

    // Remove all app data (profiles + every hosting request, sent or received).
    // Better Auth data (sessions/accounts/user) is cleared client-side by
    // `authClient.deleteUser()`, which also signs the user out everywhere.
    await deleteUserData(ctx, identity.subject);

    return { deleted: true };
  },
});
