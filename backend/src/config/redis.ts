import { createClient } from "redis";
import { env } from "./env";
import { logger } from "../utils/logger";

/* ── Client ──────────────────────────────────────────── */
export const redis = createClient({
  url: env.REDIS_URL,
  socket: {
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        // ✅ Give up quickly and silently — Redis is optional
        return false;
      }
      return Math.min(retries * 200, 1000);
    },
  },
});

redis.on("error",        ()  => { /* silent — Redis is optional */ });
redis.on("connect",      ()  => logger.info("✅  Redis connected"));
redis.on("reconnecting", ()  => { /* silent */ });

/* ── Connect ─────────────────────────────────────────── */
export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch {
    // ✅ Non-fatal — app runs fine without Redis, just no caching
    logger.warn("⚠️  Redis not available — running without cache (this is fine for development)");
  }
}

/* ── Cache helpers (all fail silently if Redis is down) ── */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!redis.isOpen) return null;
      const raw = await redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    try {
      if (!redis.isOpen) return;
      await redis.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // Fail silently
    }
  },

  async del(key: string): Promise<void> {
    try {
      if (!redis.isOpen) return;
      await redis.del(key);
    } catch { /* noop */ }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      if (!redis.isOpen) return;
      const keys = await redis.keys(pattern);
      if (keys.length) await redis.del(keys);
    } catch { /* noop */ }
  },
};

/* ── Cache key builders ──────────────────────────────── */
export const CacheKey = {
  salon:    (slug: string)  => `salon:${slug}`,
  salons:   (hash: string)  => `salons:${hash}`,
  featured: ()              => "salons:featured",
  trending: (area = "all")  => `salons:trending:${area}`,
  user:     (id: string)    => `user:${id}`,
  booking:  (id: string)    => `booking:${id}`,
  slots:    (salonId: string, date: string) => `slots:${salonId}:${date}`,
};