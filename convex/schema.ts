import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { SystemRole, UILanguage } from "./enums";
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
    // Avatar hosting: `image` is the URL rendered everywhere. For OAuth users
    // we copy the provider photo into Convex storage (Google rate-limits
    // hotlinking with 429s) and keep:
    //  - `imageStorageId`: the stored file, so we can delete it on replace/delete
    //  - `oauthImage`: the last provider URL we successfully ingested, to detect
    //    when the user changes their Google photo (written only on success)
    //  - `imageIsCustom`: the user uploaded their own photo — never auto-override
    imageStorageId: v.optional(v.id("_storage")),
    oauthImage: v.optional(v.string()),
    imageIsCustom: v.optional(v.boolean()),
    language: v.optional(UILanguage),
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
    .index("by_guest_host", ["guestAuthUserId", "hostAuthUserId"])
    // Latest accepted match for the public hero teaser, ordered by response time.
    .index("by_status_respondedAt", ["status", "respondedAt"]),
});
