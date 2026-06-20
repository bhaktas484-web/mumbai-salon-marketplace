import { createClient } from "redis";
import { env } from "./env";
// Logger import: fall back to console if the logger module is missing
let logger: any;
try {
  // Use require so missing module doesn't break TypeScript compile in some setups
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../utils/logger");
  logger = mod.logger ?? mod.default ?? mod;
} catch {
  // Fallback logger that matches the minimal interface used below
  logger = console;
}

/* ── Client ──────────────────────────────────────────── */
export const redis = createClient({
  url: env.REDIS_URL,
  socket: {
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error("Redis: too many retries — giving up");
        return new Error("Redis max retries exceeded");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

redis.on("error",   (err) => logger.error("Redis error:", err));
redis.on("connect", ()    => logger.info("✅  Redis connected"));
redis.on("reconnecting", () => logger.warn("⚠️   Redis reconnecting…"));

/* ── Connect ─────────────────────────────────────────── */
export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (err) {
    logger.warn("Redis unavailable — caching disabled:", err);
    // Non-fatal: app works without Redis, just slower
  }
}

/* ── Cache helpers ───────────────────────────────────── */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    try {
      await redis.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // Fail silently — cache miss is acceptable
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch { /* noop */ }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length) await redis.del(keys);
    } catch { /* noop */ }
  },
};

/* ── Cache key builders ──────────────────────────────── */
export const CacheKey = {
  salon:      (slug: string)   => `salon:${slug}`,
  salons:     (hash: string)   => `salons:${hash}`,
  featured:   ()               => "salons:featured",
  trending:   (area = "all")   => `salons:trending:${area}`,
  user:       (id: string)     => `user:${id}`,
  booking:    (id: string)     => `booking:${id}`,
  slots:      (salonId: string, date: string) => `slots:${salonId}:${date}`,
};