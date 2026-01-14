import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.url().min(1),
    NEXT_PUBLIC_CONVEX_SITE_URL: z.url().min(1),
  },

  server: {
    // BETTER_AUTH_URL: z.string().min(1),
    // ARCJET_KEY: z.string().min(1),
    AUTH_GOOGLE_CLIENT_ID: z.string().min(1),
    AUTH_GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_MAPS_API_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),

    CONVEX_DEPLOYMENT: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    SITE_URL: z.string().min(1),
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
  },
});
