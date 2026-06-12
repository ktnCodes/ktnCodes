// In-memory sliding-window rate limiter.
//
// Scope caveat: on Vercel serverless each instance has its own Map, so the
// effective limit is per-IP *per instance*. That still stops naive scripted
// abuse from a single source; a durable cross-instance limit needs Vercel
// Firewall or a KV-backed limiter (e.g. @upstash/ratelimit).

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
// Bound memory: evict the oldest-inserted key once we track this many.
const MAX_TRACKED_KEYS = 5000;

const hits = new Map<string, number[]>();

/** Returns true if the request is allowed, false if the key is over the limit. */
export function rateLimit(key: string, now: number = Date.now()): boolean {
  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  // Re-insert so Map insertion order approximates recency for eviction.
  hits.delete(key);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    const oldest = hits.keys().next().value;
    if (oldest !== undefined) hits.delete(oldest);
  }
  return true;
}

/** Test hook: clear all tracked state. */
export function resetRateLimiter(): void {
  hits.clear();
}
