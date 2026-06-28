import { v } from "convex/values";

export const REQUEST_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "cancelled",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const RequestStatusV = v.union(
  ...REQUEST_STATUSES.map((s) => v.literal(s)),
);

export const RequestFields = {
  // The two parties, both stored as Better Auth subject ids. The pairing is the
  // same regardless of direction; `initiator` says who started it.
  guestAuthUserId: v.string(),
  hostAuthUserId: v.string(),

  // Who opened this thread: a guest asking to be hosted (default / legacy), or
  // a host inviting a guest to their table. Absent = "guest" for old rows.
  initiator: v.optional(v.union(v.literal("guest"), v.literal("host"))),

  // The Shabbat / date concerned (ms timestamp).
  date: v.number(),

  // Party size — only meaningful for guest-initiated requests; host invitations
  // carry no count, so these are optional.
  adults: v.optional(v.number()),
  children: v.optional(v.number()),

  message: v.optional(v.string()),

  status: RequestStatusV,
  createdAt: v.number(),
  respondedAt: v.optional(v.number()),
};
