// Simple in-memory fixed-window limiter — enough for a single-process,
// single-VPS deployment (no Redis needed at this scale, see plan). Resets on
// process restart, which is an acceptable tradeoff at this scale, not a
// multi-instance production API.
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 5;

const attempts = new Map<string, { count: number; resetAt: number }>();

// This used to guard one login endpoint (effectively one legitimate IP ever)
// — now it also guards public leads/RSVP forms, so distinct keys can number
// in the thousands under real traffic (or an attack). Sweep expired entries
// at most once a minute rather than on every call — an O(n) scan per request
// would itself become a cost that scales with how hard someone is hammering
// the endpoint, working against the point of rate-limiting in the first place.
const SWEEP_INTERVAL_MS = 60 * 1000;
let lastSweep = 0;

function sweepExpired(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [k, v] of attempts) {
    if (now > v.resetAt) attempts.delete(k);
  }
}

// `key` should be namespaced per caller (e.g. `login:<ip>`, `leads:<ip>`) —
// callers share one Map, so an unprefixed IP would let a burst on one public
// endpoint also lock the same visitor out of an unrelated one.
export function checkRateLimit(
  key: string,
  { windowMs = DEFAULT_WINDOW_MS, maxAttempts = DEFAULT_MAX_ATTEMPTS } = {},
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  sweepExpired(now);

  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

// Not behind proxy.ts (matcher excludes /api), so x-forwarded-for comes
// straight from whatever's in front in prod (nginx, per plan) — falls back
// to a shared bucket in local dev where nothing sets it.
export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
