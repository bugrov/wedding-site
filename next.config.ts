import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on our own VPS via Docker (not Vercel) — standalone output
  // bundles a minimal Node server so the image doesn't need the full node_modules tree.
  output: "standalone",
  // `next dev` only trusts requests from the hostname it was started under
  // (localhost) by default and silently blocks dev-asset/HMR requests from
  // anything else — the page's initial HTML still renders, but client
  // components never hydrate (no error, just dead buttons/forms). Local
  // wildcard-subdomain testing goes through lvh.me (resolves to 127.0.0.1;
  // see proxy.ts + APP_BASE_DOMAIN), on both the bare domain and every
  // <slug>.lvh.me, so both need to be allowed here.
  allowedDevOrigins: ["lvh.me", "*.lvh.me"],
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
  // Defense-in-depth alongside the per-page `robots` metadata and
  // app/robots.ts: an HTTP header is honored even if a crawler ignores or
  // fails to parse the <meta> tag. Covers /sites/<slug> both via the
  // subdomain rewrite (proxy.ts) and direct access on the main domain.
  async headers() {
    const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };
    return [
      { source: "/sites/:path*", headers: [noindex] },
      { source: "/client/:path*", headers: [noindex] },
      { source: "/admin/:path*", headers: [noindex] },
    ];
  },
};

export default nextConfig;
