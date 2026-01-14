import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { SystemRole } from "./enums";
import { GuestFields } from "./validators/guest";
import { HostFields } from "./validators/host";

export default defineSchema({
  users: defineTable({
    authUserId: v.string(),
    role: SystemRole,
    isVerified: v.boolean(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  }).index("by_authUserId", ["authUserId"]),

  hosts: defineTable({
    // Link to your auth/user document (adapt to your setup)
    authUserId: v.string(),
    ...HostFields,
  })
    .index("by_authUserId", ["authUserId"])
    .index("by_sector", ["sector"])
    .index("by_ethnicity", ["ethnicity"])
    .index("by_kashrout", ["kashrout"]),

  guests: defineTable({
    authUserId: v.string(),
    ...GuestFields,
  })
    .index("by_authUserId", ["authUserId"])
    .index("by_region", ["region"])
    .index("by_gender", ["gender"])
    .index("by_sector", ["sector"])
    .index("by_ethnicity", ["ethnicity"]),
});
