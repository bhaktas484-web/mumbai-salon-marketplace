import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Note: Ensure 'zod' is installed via npm: npm install zod

/* ── Schema ──────────────────────────────────────────── */
const envSchema = z.object({
  NODE_ENV:    z.enum(["development", "production", "test"]).default("development"),
  PORT:        z.coerce.number().default(4000),
  API_PREFIX:  z.string().default("/api"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  REDIS_URL:   z.string().default("redis://localhost:6379"),

  JWT_ACCESS_SECRET:  z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 chars"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 chars"),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES:z.string().default("7d"),

  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY:    z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),

  RAZORPAY_KEY_ID:       z.string().default(""),
  RAZORPAY_KEY_SECRET:   z.string().default(""),
  RAZORPAY_WEBHOOK_SECRET: z.string().default(""),

  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  EMAIL_FROM: z.string().default("Glamr <noreply@glamr.in>"),

  FRONTEND_URL:     z.string().default("http://localhost:3000"),
  ALLOWED_ORIGINS:  z.string().default("http://localhost:3000"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX:       z.coerce.number().default(100),
});

/* ── Parse & export ──────────────────────────────────── */
const processEnv = ((globalThis as any).process as any)?.env ?? {};
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  (globalThis as any).console.error("❌  Invalid environment variables:");
  (globalThis as any).console.error(parsed.error.flatten().fieldErrors);
  ((globalThis as any).process as any)?.exit?.(1);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
export const isDev  = env.NODE_ENV === "development";