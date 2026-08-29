// Builds the public URL for a project's subdomain site / client portal.
// http in dev (APP_BASE_DOMAIN is a plain lvh.me:port there, no TLS) — only
// prod, behind nginx per the plan, actually terminates https.
const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";

export function getSiteUrl(slug: string): string {
  const baseDomain = process.env.APP_BASE_DOMAIN;
  return baseDomain ? `${PROTOCOL}://${slug}.${baseDomain}` : `/sites/${slug}`;
}

// /client/[token] lives on the base app domain, not a per-couple subdomain
// (see plan's code structure) — proxy.ts only rewrites <slug>.<domain>, so
// the bare base domain reaches this route untouched.
export function getClientUrl(token: string): string {
  const baseDomain = process.env.APP_BASE_DOMAIN;
  return baseDomain ? `${PROTOCOL}://${baseDomain}/client/${token}` : `/client/${token}`;
}
