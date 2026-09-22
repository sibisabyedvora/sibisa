import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '@/lib/env';

// In-memory fallback map when Upstash Redis is not configured locally
const memoryStore = new Map<string, { count: number; resetTime: number }>();

function checkMemoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + windowMs });
    return true; // Allowed
  }

  if (record.count >= limit) {
    return false; // Rate limit exceeded
  }

  record.count += 1;
  return true; // Allowed
}

let redisRatelimitIp: Ratelimit | null = null;
let redisRatelimitSession: Ratelimit | null = null;

if (
  env.UPSTASH_REDIS_REST_URL &&
  env.UPSTASH_REDIS_REST_TOKEN &&
  !env.UPSTASH_REDIS_REST_URL.includes('your-redis')
) {
  try {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    redisRatelimitIp = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'ratelimit:ip',
    });

    redisRatelimitSession = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '1 h'),
      analytics: true,
      prefix: 'ratelimit:session',
    });
  } catch (err) {
    console.warn('[SIBISA Ratelimit] Failed to initialize Upstash Redis, falling back to memory:', err);
  }
}

export async function checkRateLimit(ipHash: string, sessionId: string): Promise<{ success: boolean; remaining: number }> {
  // If Upstash Redis is active
  if (redisRatelimitIp && redisRatelimitSession) {
    try {
      const ipRes = await redisRatelimitIp.limit(ipHash);
      if (!ipRes.success) {
        return { success: false, remaining: ipRes.remaining };
      }

      const sessionRes = await redisRatelimitSession.limit(sessionId);
      if (!sessionRes.success) {
        return { success: false, remaining: sessionRes.remaining };
      }

      return { success: true, remaining: Math.min(ipRes.remaining, sessionRes.remaining) };
    } catch (err) {
      console.warn('[SIBISA Ratelimit] Upstash Redis check failed, using memory fallback:', err);
    }
  }

  // In-Memory Fallback
  const ipAllowed = checkMemoryRateLimit(`ip:${ipHash}`, 10, 60 * 1000);
  if (!ipAllowed) return { success: false, remaining: 0 };

  const sessionAllowed = checkMemoryRateLimit(`session:${sessionId}`, 60, 60 * 60 * 1000);
  if (!sessionAllowed) return { success: false, remaining: 0 };

  return { success: true, remaining: 10 };
}
