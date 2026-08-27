import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on our own VPS via Docker (not Vercel) — standalone output
  // bundles a minimal Node server so the image doesn't need the full node_modules tree.
  output: "standalone",
  images: {
    // images.unsplash.com/images.pexels.com cover the template-level
    // decorative stock photos. The wildcard covers real client content
    // (cover/story/gallery photoUrl) now that clients submit their own
    // photo links directly through the public configurator — no way to
    // know their hosting domain in advance. Trade-off: Next's image
    // optimizer will server-fetch whatever https URL a visitor submits.
    // Bounded risk (it validates the response is actually image content,
    // not arbitrary data) and the standard pattern for user-submitted
    // image URLs, but worth remembering if this ever needs tightening.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
