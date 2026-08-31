import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { slugSchema } from "@/lib/schemas/slug";

// Caddy's on-demand TLS "ask" check (see Caddyfile: `on_demand_tls { ask ... }`).
// Without this, anyone who points DNS at our IP could make Caddy request a
// cert for their own hostname, risking Let's Encrypt rate-limit exhaustion
// for wedding-press.ru itself. Only allow hostnames that could ever actually
// be reached (same charset proxy.ts requires of a slug).
const APP_BASE_DOMAIN = (process.env.APP_BASE_DOMAIN ?? "").toLowerCase();

export function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain")?.toLowerCase() ?? "";
  if (!APP_BASE_DOMAIN) {
    return new NextResponse(null, { status: 403 });
  }

  // The apex and `www` also fall under the `*.<domain>` automation policy in
  // the Caddyfile (Caddy's on-demand TLS covers any name matching the
  // wildcard, even ones also listed in the static site block) — allow them
  // explicitly, since slugSchema itself rejects "www" as a reserved slug.
  if (domain === APP_BASE_DOMAIN || domain === `www.${APP_BASE_DOMAIN}`) {
    return new NextResponse(null, { status: 200 });
  }

  const suffix = `.${APP_BASE_DOMAIN}`;
  if (!domain.endsWith(suffix)) {
    return new NextResponse(null, { status: 403 });
  }

  const slug = domain.slice(0, -suffix.length);
  if (!slugSchema.safeParse(slug).success) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, { status: 200 });
}
