import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

// Everything behind auth is worthless to a crawler and leaks structure, so the
// public surface is an allowlist by omission: only the marketing and entry
// pages stay indexable.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.SITE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/dev/",
        "/account",
        "/complete-registration",
        "/reset-password",
        "/forgot-password",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
