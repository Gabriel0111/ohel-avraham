import { v } from "convex/values";

export type RoleType = "admin" | "user" | "guest" | "host" | "guest:host";

export const SystemRole = v.union(
  v.literal("user"),
  v.literal("guest"),
  v.literal("host"),
  v.literal("admin"),
  v.literal("guest:host"),
);

// UI locale (mirrors `Language` in lib/i18n/translations.ts) — distinct from
// the guests/hosts "languages spoken" enum, which is a much wider set used
// for matching, not interface display.
export type UILanguageType = "en" | "fr" | "he";

export const UILanguage = v.union(
  v.literal("en"),
  v.literal("fr"),
  v.literal("he"),
);
