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
  // Requester (guest) and target (host), both stored as Better Auth subject ids.
  guestAuthUserId: v.string(),
  hostAuthUserId: v.string(),

  // The Shabbat / date the guest is asking to be hosted (ms timestamp).
  date: v.number(),

  // Party size.
  adults: v.number(),
  children: v.number(),

  message: v.optional(v.string()),

  status: RequestStatusV,
  createdAt: v.number(),
  respondedAt: v.optional(v.number()),
};
