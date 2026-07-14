import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Only what the Next.js app itself reads. The backend runs on Convex, which has
 * its own environment (`npx convex env set … --prod`) and reads `process.env`
 * directly in its own runtime: `SITE_URL`, `BETTER_AUTH_SECRET`,
 * `AUTH_GOOGLE_*` and `RESEND_API_KEY` are declared *there*, not here.
 * Declaring them here too would make them mandatory at Next build time — and
 * fail the Vercel build over secrets Next never touches.
 */
export const env = createEnv({
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.url().min(1),
    NEXT_PUBLIC_CONVEX_SITE_URL: z.url().min(1),
    // Browser-side Maps JavaScript API. Public by nature: restrict it by HTTP
    // referrer in the Google console. Never use it server-side — a request from
    // Vercel carries no referrer and a referrer-restricted key would be rejected.
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1),
  },

  server: {
    // Canonical origin, no trailing slash. Drives `metadataBase`, robots.txt
    // and sitemap.xml — all three are baked at build time, so this must be set
    // in Vercel *before* the build or they will point at localhost.
    SITE_URL: z.url(),
    // Server-side Places API, used by the /api/places routes. Kept separate
    // from the public key so it can be locked to the Places API and never ships
    // in the client bundle.
    GOOGLE_MAPS_API_KEY: z.string().min(1),
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
});
