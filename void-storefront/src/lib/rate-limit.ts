/**
 * Simple in-memory rate limiter using sliding window
 *
 * For production with multiple instances, consider using Redis
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Max requests per window
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check rate limit for a given identifier (usually IP address)
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { windowMs = 60000, maxRequests = 10 } = options;

  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  let entry = rateLimitStore.get(key);

  // If no entry or window has expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request headers
 * Uses X-Forwarded-For for proxied requests (Vercel)
 */
export function getClientIdentifier(headers: Headers): string {
  // Try X-Forwarded-For first (Vercel/proxy)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // Get the first IP in the chain
    return forwarded.split(',')[0].trim();
  }

  // Fallback to X-Real-IP
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Default fallback
  return 'unknown';
}
