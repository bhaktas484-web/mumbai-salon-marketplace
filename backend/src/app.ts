import express, { type Application } from "express";
import cors            from "cors";
import helmet         from "helmet";
import morgan         from "morgan";
import compression    from "compression";
import cookieParser   from "cookie-parser";
import mongoSanitize  from "express-mongo-sanitize";
import hpp            from "hpp";

import { env }              from "./config/env";
import { connectDB }        from "./config/db";
import { connectRedis }     from "./config/redis";
import { logger }           from "./utils/logger";
import { apiLimiter }       from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

/* ── Route imports ───────────────────────────────────── */
import { authRouter }     from "./modules/auth/auth.routes";
import { salonRouter }    from "./modules/salons/salon.routes";
import { bookingRouter }  from "./modules/bookings/booking.routes";
import { reviewRouter }   from "./modules/reviews/review.routes";
import { paymentRouter }  from "./modules/payments/payment.routes";

/* ═══════════════════════════════════════════════════════
   Bootstrap
════════════════════════════════════════════════════════ */
async function bootstrap(): Promise<void> {
  /* 1. Database connections */
  await connectDB();
  await connectRedis();

  /* 2. Create Express app */
  const app: Application = express();

  /* ── Security ────────────────────────────────────── */
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,   // Handled by Next.js
  }));

  app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(",").map(o => o.trim()),
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  app.use(mongoSanitize());   // Prevent NoSQL injection
  app.use(hpp());             // Prevent HTTP Parameter Pollution

  /* ── Body parsing ────────────────────────────────── */
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(cookieParser());

  /* ── Compression & logging ───────────────────────── */
  app.use(compression());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }));

  /* ── Rate limiting ───────────────────────────────── */
  app.use(`${env.API_PREFIX}`, apiLimiter);

  /* ── Health check ────────────────────────────────── */
  app.get("/health", (_req, res) => {
    res.json({
      status:    "ok",
      timestamp: new Date().toISOString(),
      uptime:    process.uptime(),
      env:       env.NODE_ENV,
    });
  });

  /* ── Routes ──────────────────────────────────────── */
  app.use(`${env.API_PREFIX}/auth`,     authRouter);
  app.use(`${env.API_PREFIX}/salons`,   salonRouter);
  app.use(`${env.API_PREFIX}/bookings`, bookingRouter);
  app.use(`${env.API_PREFIX}/reviews`,  reviewRouter);
  app.use(`${env.API_PREFIX}/payments`, paymentRouter);

  /* ── 404 & error handlers ────────────────────────── */
  app.use(notFoundHandler);
  app.use(errorHandler);

  /* 3. Start server */
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀  Server running on http://localhost:${env.PORT}`);
    logger.info(`📍  API prefix: ${env.API_PREFIX}`);
    logger.info(`🌍  Environment: ${env.NODE_ENV}`);
  });

  /* ── Graceful shutdown ───────────────────────────── */
  const shutdown = (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully…`);
    server.close(async () => {
      const { disconnectDB } = await import("./config/db");
      await disconnectDB();
      logger.info("Server closed");
      process.exit(0);
    });
    setTimeout(() => { logger.error("Forced shutdown"); process.exit(1); }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));
  process.on("uncaughtException",  (err) => { logger.error("Uncaught exception:",  err); process.exit(1); });
  process.on("unhandledRejection", (err) => { logger.error("Unhandled rejection:", err); process.exit(1); });
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});