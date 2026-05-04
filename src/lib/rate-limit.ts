/**
 * Simple in-memory token bucket rate limiter.
 *
 * IMPORTANT — production caveat:
 * On Vercel (or any serverless platform), each function instance has its own
 * memory. This limiter is therefore PER INSTANCE, not global. Determined
 * abusers spinning up many instances can bypass it.
 *
 * For production, swap the implementation for an external store. Recommended:
 *   - @upstash/ratelimit + Upstash Redis (works well on Vercel; free tier OK)
 *   - The keep the same { allowed, resetAt, remaining } return shape so callers
 *     don't change.
 *
 * For local development, branch previews, and modest production traffic on a
 * single instance, this is sufficient first-line defense alongside the honeypot
 * and Zod validation.
 */

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  resetAt: number;
  remaining: number;
};

export function rateLimit(
  key: string,
  opts: { max: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.reset <= now) {
    const reset = now + opts.windowMs;
    buckets.set(key, { count: 1, reset });
    return { allowed: true, resetAt: reset, remaining: opts.max - 1 };
  }

  if (existing.count >= opts.max) {
    return { allowed: false, resetAt: existing.reset, remaining: 0 };
  }

  existing.count += 1;
  return {
    allowed: true,
    resetAt: existing.reset,
    remaining: opts.max - existing.count,
  };
}
