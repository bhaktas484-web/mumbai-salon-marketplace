import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";
import { env } from "../config/env";

/* ── Global error handler ────────────────────────────── */
export function errorHandler(
  err: Error,
  _req: Request,
  res:  Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message    = "Internal server error";
  let errors: unknown;

  /* ── AppError (operational) ──────────────────────── */
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message    = err.message;
    errors     = err.errors;
  }

  /* ── Mongoose validation error ───────────────────── */
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message    = "Validation error";
    errors     = Object.values(err.errors).map(e => ({
      field:   e.path,
      message: e.message,
    }));
  }

  /* ── Mongoose duplicate key ──────────────────────── */
  else if ((err as NodeJS.ErrnoException).name === "MongoServerError" &&
           (err as { code?: number }).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0];
    message    = `${field ?? "Field"} already exists`;
  }

  /* ── Mongoose cast error (invalid ID) ────────────── */
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message    = `Invalid ${err.path}: ${String(err.value)}`;
  }

  /* ── JWT errors ──────────────────────────────────── */
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message    = "Invalid token";
  }
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message    = "Token expired";
  }

  /* ── Log non-operational errors ──────────────────── */
  if (statusCode >= 500) {
    logger.error("Unhandled error:", { message: err.message, stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(env.NODE_ENV === "development" && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}

/* ── Not found handler ───────────────────────────────── */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
}