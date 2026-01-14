import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Must include the protocol
        hostname: "cdn.shadcnstudio.com", // The domain name
        port: "", // Optional, leave empty if not using a specific port
      },
    ],
  },
};

export default nextConfig;
