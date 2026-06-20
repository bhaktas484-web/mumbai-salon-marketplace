import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/* ── General API rate limit ──────────────────────────── */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max:      env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: "Too many requests — please try again later.",
  },
});

/* ── Auth routes (stricter) ──────────────────────────── */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min
  max:      10,                // 10 attempts
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: "Too many login attempts — please try again in 15 minutes.",
  },
});

/* ── Booking creation (prevent abuse) ────────────────── */
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max:      20,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: "Too many bookings created — please slow down.",
  },
});