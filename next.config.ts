import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Must include the protocol
        hostname: "cdn.shadcnstudio.com", // The domain name
        port: "", // Optional, leave empty if not using a specific port
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
        port: "",
      },
      {
        // Avatars live in Convex storage, and each deployment (dev, preview,
        // production) serves them from its own subdomain — so this is matched
        // by pattern rather than pinned to one deployment. Narrowed to the
        // storage path: nothing else on a Convex host is an image.
        protocol: "https",
        hostname: "**.convex.cloud",
        pathname: "/api/storage/**",
      },
    ],
  },
};

export default nextConfig;
