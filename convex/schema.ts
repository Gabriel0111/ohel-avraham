import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { SystemRole } from "./enums";
import { GuestFields } from "./validators/guest";
import { HostFields } from "./validators/host";
import { RequestFields } from "./validators/request";

export default defineSchema({
  users: defineTable({
    authUserId: v.string(),
    role: SystemRole,
    isVerified: v.boolean(),
    isBlocked: v.optional(v.boolean()),
    verifiedBy: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  }).index("by_authUserId", ["authUserId"]),

  hosts: defineTable({
    authUserId: v.string(),
    ...HostFields,
  })
    .index("by_authUserId", ["authUserId"])
    .index("by_sector", ["sector"])
    .index("by_ethnicity", ["ethnicity"])
    .index("by_kashrout", ["kashrout"])
    .searchIndex("search_address", {
      searchField: "address",
      filterFields: ["sector", "ethnicity", "kashrout"],
    }),

  guests: defineTable({
    authUserId: v.string(),
    ...GuestFields,
  })
    .index("by_authUserId", ["authUserId"])
    .index("by_region", ["region"])
    .index("by_gender", ["gender"])
    .index("by_sector", ["sector"])
    .index("by_ethnicity", ["ethnicity"]),

  requests: defineTable({
    ...RequestFields,
  })
    .index("by_guest", ["guestAuthUserId"])
    .index("by_host", ["hostAuthUserId"])
    .index("by_host_status", ["hostAuthUserId", "status"])
    .index("by_guest_status", ["guestAuthUserId", "status"])
    .index("by_guest_host", ["guestAuthUserId", "hostAuthUserId"]),
});
