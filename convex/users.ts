import { SystemRole } from "./enums";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { canModifyRole } from "./helpers/canModifyRole";
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
    if (!canModifyRole(currentRole, targetCurrentRole)) {
      throw new Error(
        `Insufficient permissions: ${currentRole} cannot modify ${targetCurrentRole}`,
      );
    }

    if (!canModifyRole(currentRole, args.role)) {
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

//
// // Query pour vérifier les permissions d'un utilisateur
// export const checkPermissions = query({
//   args: {
//     userId: v.id("user"),
//     targetUserId: v.id("user"),
//   },
//   handler: async (ctx, args) => {
//     const actor = await ctx.db.get(args.userId);
//     const target = await ctx.db.get(args.targetUserId);
//
//     if (!actor || !target) {
//       return { canModify: false, canDelete: false, canAssignRole: false };
//     }
//
//     const actorRole = actor.role || "user";
//     const targetRole = target.role || "user";
//
//     return {
//       actorRole,
//       targetRole,
//       canModify: canModifyRole(actorRole, targetRole),
//       canDelete: canModifyRole(actorRole, targetRole),
//       canAssignRole: canModifyRole(actorRole, targetRole),
//       actorLevel: ROLE_HIERARCHY[actorRole as keyof typeof ROLE_HIERARCHY],
//       targetLevel: ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY],
//     };
//   },
// });
//
// // ============================================
// // GESTION DES PROFILS GUEST/HOST
// // ============================================
//
// export const createGuestProfile = mutation({
//   args: {
//     userId: v.id("users"),
//     dob: v.number(),
//     region: v.string(),
//     gender: Gender,
//     sector: Sector,
//     ethnicity: Ethnicity,
//     notes: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.db.get(args.userId);
//     if (!user) {
//       throw new Error("User not found");
//     }
//
//     if (!user.roles.find((a) => a === "user")) {
//       throw new Error(
//         "Only users with role 'user' can have guest/host profiles",
//       );
//     }
//
//     // Vérifier si un guest existe déjà
//     const existingGuest = await ctx.db
//       .query("guests")
//       .withIndex("by_userId", (q) => q.eq("userId", args.userId))
//       .first();
//
//     if (existingGuest) {
//       throw new Error("Guest profile already exists for this user");
//     }
//
//     const now = Date.now();
//
//     // Créer le profil guest
//     const guestId = await ctx.db.insert("guests", {
//       userId: args.userId,
//       dob: args.dob,
//       region: args.region,
//       gender: args.gender,
//       sector: args.sector,
//       ethnicity: args.ethnicity,
//       notes: args.notes,
//       createdAt: now,
//       updatedAt: now,
//     });
//
//     // Vérifier si l'utilisateur est déjà host
//     const existingHost = await ctx.db
//       .query("hosts")
//       .withIndex("by_userId", (q) => q.eq("userId", args.userId))
//       .first();
//
//     // Mettre à jour le userType
//     const newUserType = existingHost ? "both" : "guest";
//
//     await ctx.db.patch(args.userId, {
//       userType: newUserType,
//     });
//
//     return guestId;
//   },
// });
//
// // Mutation pour créer un profil Host (seulement si role = "user")
// export const createHostProfile = mutation({
//   args: {
//     userId: v.id("user"),
//     dob: v.number(),
//     phoneNumber: v.string(),
//     address: v.string(),
//     floor: v.number(),
//     hasDisabilityAccess: v.boolean(),
//     kashrout: Kashrout,
//     sector: Sector,
//     ethnicity: Ethnicity,
//     notes: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     // Vérifier que l'utilisateur a le rôle "user"
//     const user = await ctx.db.get(args.userId);
//     if (!user) {
//       throw new Error("User not found");
//     }
//
//     if (user.role !== "user") {
//       throw new Error(
//         "Only users with role 'user' can have guest/host profiles",
//       );
//     }
//
//     // Vérifier si un host existe déjà
//     const existingHost = await ctx.db
//       .query("hosts")
//       .withIndex("by_userId", (q) => q.eq("userId", args.userId))
//       .first();
//
//     if (existingHost) {
//       throw new Error("Host profile already exists for this user");
//     }
//
//     const now = Date.now();
//
//     // Créer le profil host
//     const hostId = await ctx.db.insert("hosts", {
//       userId: args.userId,
//       dob: args.dob,
//       phoneNumber: args.phoneNumber,
//       address: args.address,
//       floor: args.floor,
//       hasDisabilityAccess: args.hasDisabilityAccess,
//       kashrout: args.kashrout,
//       sector: args.sector,
//       ethnicity: args.ethnicity,
//       notes: args.notes,
//       createdAt: now,
//       updatedAt: now,
//     });
//
//     // Vérifier si l'utilisateur est déjà guest
//     const existingGuest = await ctx.db
//       .query("guests")
//       .withIndex("by_userId", (q) => q.eq("userId", args.userId))
//       .first();
//
//     // Mettre à jour le userType
//     const newUserType = existingGuest ? "both" : "host";
//
//     await ctx.db.patch(args.userId, {
//       userType: newUserType,
//     });
//
//     return hostId;
//   },
// });
//
// // Query pour récupérer le profil complet d'un utilisateur
// export const getUserProfile = query({
//   args: { userId: v.id("user") },
//   handler: async (ctx, args) => {
//     const user = await ctx.db.get(args.userId);
//
//     if (!user) {
//       throw new Error("User not found");
//     }
//
//     // Si l'utilisateur est admin ou rabbi, pas de profil guest/host
//     if (user.role === "admin" || user.role === "rabbi") {
//       return {
//         userId: args.userId,
//         role: user.role,
//         userType: null,
//         guest: null,
//         host: null,
//         permissions: {
//           level: ROLE_HIERARCHY[user.role],
//           canManageUsers: true,
//           canManageRabbis: user.role === "admin",
//         },
//       };
//     }
//
//     // Pour les users, charger les profils selon le userType
//     let guest = null;
//     let host = null;
//
//     if (user.userType === "guest" || user.userType === "both") {
//       guest = await ctx.db
//         .query("guests")
//         .withIndex("by_userId", (q) => q.eq("userId", args.userId))
//         .first();
//     }
//
//     if (user.userType === "host" || user.userType === "both") {
//       host = await ctx.db
//         .query("hosts")
//         .withIndex("by_userId", (q) => q.eq("userId", args.userId))
//         .first();
//     }
//
//     return {
//       userId: args.userId,
//       role: user.role || "user",
//       userType: user.userType,
//       guest,
//       host,
//       permissions: {
//         level: ROLE_HIERARCHY[user.role || "user"],
//         canManageUsers: false,
//         canManageRabbis: false,
//       },
//     };
//   },
// });
