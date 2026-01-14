import { v } from "convex/values";

export type RoleType =
  | "admin"
  | "rabbi"
  | "user"
  | "guest"
  | "host"
  | "guest:host";

export const SystemRole = v.union(
  v.literal("user"),
  v.literal("guest"),
  v.literal("host"),
  v.literal("rabbi"),
  v.literal("admin"),
  v.literal("guest:host"),
);
