import { ConvexError } from "convex/values";

/**
 * Semantic error keys. Both error sources (Better Auth + Convex) are
 * normalized onto this single keyspace, which mirrors `t.errors.*` in
 * `lib/i18n/translations.ts`. `unexpected` is the localized fallback.
 */
export type ErrorKey =
  | "invalidCredentials"
  | "userAlreadyExists"
  | "emailNotVerified"
  | "invalidEmail"
  | "passwordLength"
  | "unauthorized"
  | "profileCreateFailed"
  | "unexpected";

/**
 * Explicit alias table: raw source code (Better Auth `code`, `ConvexError`
 * code, or a known raw message) -> semantic key. Explicit mapping (rather
 * than a SCREAMING_SNAKE -> camelCase transform) lets us collapse duplicate
 * codes cleanly and keeps surprises out.
 */
const ERROR_ALIASES: Record<string, ErrorKey> = {
  // Better Auth — credentials
  INVALID_EMAIL_OR_PASSWORD: "invalidCredentials",
  INVALID_PASSWORD: "invalidCredentials",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "invalidCredentials",
  USER_NOT_FOUND: "invalidCredentials",
  // Better Auth — duplicate account
  USER_ALREADY_EXISTS: "userAlreadyExists",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "userAlreadyExists",
  // Better Auth — verification / validation
  EMAIL_NOT_VERIFIED: "emailNotVerified",
  INVALID_EMAIL: "invalidEmail",
  PASSWORD_TOO_SHORT: "passwordLength",
  PASSWORD_TOO_LONG: "passwordLength",
  // Convex codes / raw messages
  unauthorized: "unauthorized",
  Unauthorized: "unauthorized",
  profileCreateFailed: "profileCreateFailed",
};

/**
 * Extracts a raw code (and any dynamic data) from an unknown error, probing
 * the known shapes in order: `ConvexError` first (its `.data` is the only
 * thing that survives a production Convex deployment), then the Better Auth
 * error shape (`{ code, message }`), then a plain string.
 */
function rawCodeFrom(e: unknown): {
  code: string;
  data?: Record<string, unknown>;
} {
  if (e instanceof ConvexError) {
    const d = e.data as unknown;
    if (typeof d === "string") return { code: d };
    if (d && typeof d === "object") {
      const obj = d as Record<string, unknown>;
      if (typeof obj.code === "string") return { code: obj.code, data: obj };
    }
    return { code: e.message };
  }

  if (e && typeof e === "object") {
    const obj = e as { code?: unknown; message?: unknown };
    if (typeof obj.code === "string" && obj.code) return { code: obj.code };
    if (typeof obj.message === "string" && obj.message) {
      return { code: obj.message };
    }
  }

  if (typeof e === "string" && e) return { code: e };

  return { code: "" };
}

/**
 * Normalizes any error from Better Auth or Convex into a `{ key, data }`
 * pair. `data` carries dynamic values attached to a `ConvexError` so a
 * translation entry can be a template function.
 */
export function parseError(e: unknown): {
  key: ErrorKey;
  data?: Record<string, unknown>;
} {
  const { code, data } = rawCodeFrom(e);
  return { key: ERROR_ALIASES[code] ?? "unexpected", data };
}
