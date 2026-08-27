import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on our own VPS via Docker (not Vercel) — standalone output
  // bundles a minimal Node server so the image doesn't need the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
