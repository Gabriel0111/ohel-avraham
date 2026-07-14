import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

// Language lives in a cookie, not the URL, so every page has exactly one
// address — there are no per-language variants to declare here.
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = env.SITE_URL;
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/sign-up`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/login`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
