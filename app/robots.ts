import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const APP_BASE_DOMAIN = (process.env.APP_BASE_DOMAIN ?? "").toLowerCase();

// Request-time API (headers()) makes this dynamic per Host — required here
// because a client site's subdomain and the main marketing domain are served
// by the same Next app (see proxy.ts) but need opposite crawl policies.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.toLowerCase() ?? "";
  const isMainDomain =
    !APP_BASE_DOMAIN || host === APP_BASE_DOMAIN || host === `www.${APP_BASE_DOMAIN}`;

  if (!isMainDomain) {
    // <slug>.<APP_BASE_DOMAIN>: a couple's private wedding invitation. Never
    // meant to be discoverable via search — the invite link is the only
    // intended distribution channel, and the page carries real personal data
    // (names, wedding date, guest RSVPs).
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /sites/<slug> is the same guest-facing content reachable directly on
      // the main domain (see app/sites/[slug]/page.tsx) — same policy as the
      // subdomain. /admin and /client are internal/token-gated, not content.
      disallow: ["/admin/", "/client/", "/sites/"],
    },
  };
}
