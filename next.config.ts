import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on our own VPS via Docker (not Vercel) — standalone output
  // bundles a minimal Node server so the image doesn't need the full node_modules tree.
  output: "standalone",
  images: {
    // Template-level decorative stock photos (Unsplash/Pexels) — approved
    // per the plan's asset-approval process. Client-uploaded content photos
    // will need their own storage domain added here later.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
