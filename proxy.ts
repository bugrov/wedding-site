import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (same mechanism, new name
// and file convention — see node_modules/next/dist/docs/.../proxy.md).
//
// Determines which project's site to serve from the request's subdomain
// (see plan: "Поддомены: wildcard DNS + Next.js middleware"). Only extracts
// the slug and rewrites the URL here — the actual DB lookup happens in the
// page itself (Server Component), not here: Proxy isn't meant for slow data
// fetching per the Next.js docs.
const APP_BASE_DOMAIN = (process.env.APP_BASE_DOMAIN ?? "").toLowerCase();

export function proxy(request: NextRequest) {
  if (!APP_BASE_DOMAIN) return NextResponse.next();

  const host = request.headers.get("host")?.toLowerCase() ?? "";
  if (host === APP_BASE_DOMAIN || host === `www.${APP_BASE_DOMAIN}`) {
    return NextResponse.next();
  }

  const suffix = `.${APP_BASE_DOMAIN}`;
  if (!host.endsWith(suffix)) return NextResponse.next();

  const slug = host.slice(0, -suffix.length);
  // Guards against a malformed/spoofed Host header injecting extra path
  // segments into the rewritten URL — real slugs are lowercase-alphanumeric
  // with hyphens (see plan: `имя1-имя2` subdomains).
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/sites/${slug}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
