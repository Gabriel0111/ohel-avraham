import type { QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

/** User fields exposed alongside host/guest rows in admin/people listings. */
export type AttachedUserFields = {
  userId: Doc<"users">["_id"];
  name: Doc<"users">["name"];
  email: Doc<"users">["email"];
  image: Doc<"users">["image"];
  role: Doc<"users">["role"];
  isVerified: Doc<"users">["isVerified"];
  isBlocked: boolean;
  verifiedBy: Doc<"users">["verifiedBy"];
  verifiedAt: Doc<"users">["verifiedAt"];
};

/**
 * Enriches a list of docs keyed by `authUserId` with their owning user's
 * public fields. Loads every user once into a Map instead of issuing one
 * query per row (avoids an N+1), and drops rows whose user is missing.
 */
export async function attachUsers<T extends { authUserId: string }>(
  ctx: QueryCtx,
  rows: T[],
): Promise<(T & AttachedUserFields)[]> {
  const users = await ctx.db.query("users").collect();
  const usersByAuthId = new Map(users.map((u) => [u.authUserId, u]));

  return rows.flatMap((row) => {
    const user = usersByAuthId.get(row.authUserId);
    if (!user) return [];

    return [
      {
        ...row,
        userId: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked ?? false,
        verifiedBy: user.verifiedBy,
        verifiedAt: user.verifiedAt,
      },
    ];
  });
}
