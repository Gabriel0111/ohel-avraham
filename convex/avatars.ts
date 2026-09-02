import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  type ActionCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { isConvexStorageUrl, isIngestibleImageUrl } from "./helpers/avatarUrl";

// Cap on the avatar we're willing to pull from a provider CDN (bytes).
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

/**
 * Downloads `sourceUrl` and, on success, stores it in Convex file storage and
 * points the user's `image` at our own copy. Shared by the OAuth ingest path
 * and the one-off migration. Never throws — a failure just leaves the existing
 * avatar in place, to be retried on the user's next login.
 */
async function ingestAvatar(
  ctx: ActionCtx,
  authUserId: string,
  sourceUrl: string,
): Promise<void> {
  let blob: Blob;
  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) {
      console.warn(`avatar ingest: ${res.status} for ${authUserId}`);
      return;
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      console.warn(`avatar ingest: non-image (${contentType}) for ${authUserId}`);
      return;
    }
    blob = await res.blob();
  } catch (err) {
    console.warn(`avatar ingest: fetch failed for ${authUserId}`, err);
    return;
  }

  if (blob.size === 0 || blob.size > MAX_AVATAR_BYTES) {
    console.warn(`avatar ingest: bad size ${blob.size} for ${authUserId}`);
    return;
  }

  const storageId = await ctx.storage.store(blob);
  const url = await ctx.storage.getUrl(storageId);
  if (!url) {
    await ctx.storage.delete(storageId);
    return;
  }

  await ctx.runMutation(internal.avatars.applyIngestedImage, {
    authUserId,
    storageId,
    url,
    sourceUrl,
  });
}

export const ingestFromUrl = internalAction({
  args: { authUserId: v.string(), sourceUrl: v.string() },
  returns: v.null(),
  handler: async (ctx, { authUserId, sourceUrl }) => {
    await ingestAvatar(ctx, authUserId, sourceUrl);
    return null;
  },
});

/**
 * Commits a freshly stored avatar to the user doc, or discards it if the user
 * is gone / has since picked a custom photo. Also deletes the file it replaces.
 */
export const applyIngestedImage = internalMutation({
  args: {
    authUserId: v.string(),
    storageId: v.id("_storage"),
    url: v.string(),
    sourceUrl: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { authUserId, storageId, url, sourceUrl }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    // No user, or they uploaded their own photo in the meantime — drop the file.
    const isPreExistingCustom =
      isConvexStorageUrl(user?.image) && !user?.oauthImage;
    if (!user || user.imageIsCustom || isPreExistingCustom) {
      await ctx.storage.delete(storageId);
      return null;
    }

    // Nothing changed since we started (e.g. two logins raced) — skip the churn.
    if (user.oauthImage === sourceUrl && user.imageStorageId) {
      await ctx.storage.delete(storageId);
      return null;
    }

    const previous = user.imageStorageId;
    await ctx.db.patch(user._id, {
      image: url,
      imageStorageId: storageId,
      oauthImage: sourceUrl,
    });
    if (previous && previous !== storageId) {
      await ctx.storage.delete(previous);
    }
    return null;
  },
});

// ─── One-off migration for avatars stored before this change ──────────────────
// Run from the Convex dashboard: `npx convex run avatars:migrateExistingAvatars`

export const _pageOfUsersToMigrate = internalQuery({
  args: { cursor: v.union(v.string(), v.null()) },
  returns: v.object({
    page: v.array(
      v.object({
        authUserId: v.string(),
        image: v.optional(v.string()),
        imageIsCustom: v.optional(v.boolean()),
        oauthImage: v.optional(v.string()),
      }),
    ),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, { cursor }) => {
    const result = await ctx.db
      .query("users")
      .paginate({ numItems: 50, cursor });
    return {
      page: result.page.map((u) => ({
        authUserId: u.authUserId,
        image: u.image,
        imageIsCustom: u.imageIsCustom,
        oauthImage: u.oauthImage,
      })),
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

/** Backfills `imageIsCustom` for users who already uploaded their own photo. */
export const _markCustom = internalMutation({
  args: { authUserId: v.string() },
  returns: v.null(),
  handler: async (ctx, { authUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();
    if (user && !user.imageIsCustom) {
      await ctx.db.patch(user._id, { imageIsCustom: true });
    }
    return null;
  },
});

export const migrateExistingAvatars = internalAction({
  args: { cursor: v.optional(v.union(v.string(), v.null())) },
  returns: v.null(),
  handler: async (ctx, { cursor }): Promise<null> => {
    const { page, isDone, continueCursor } = await ctx.runQuery(
      internal.avatars._pageOfUsersToMigrate,
      { cursor: cursor ?? null },
    );

    for (const u of page) {
      if (u.imageIsCustom) continue;
      if (isConvexStorageUrl(u.image)) {
        // Already a Convex-hosted file with no `oauthImage` → a pre-field
        // upload. Lock it so `syncOAuthAvatar` won't clobber it.
        if (!u.oauthImage) {
          await ctx.runMutation(internal.avatars._markCustom, {
            authUserId: u.authUserId,
          });
        }
        continue;
      }
      if (isIngestibleImageUrl(u.image)) {
        await ingestAvatar(ctx, u.authUserId, u.image);
      }
    }

    if (!isDone) {
      await ctx.scheduler.runAfter(0, internal.avatars.migrateExistingAvatars, {
        cursor: continueCursor,
      });
    }
    return null;
  },
});
