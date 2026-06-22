import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { User } from "../modules/auth/user.model"; // ✅ Fixed: removed ".ts" extension

/* ── Extend Express Request ──────────────────────────── */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id:    string;
        email: string;
        role:  "customer" | "salon_owner" | "admin";
      };
    }
  }
}

interface JwtPayload {
  id:    string;
  email: string;
  role:  "customer" | "salon_owner" | "admin";
  iat:   number;
  exp:   number;
}

/* ── Protect: require valid JWT ──────────────────────── */
export async function protect(
  req:  Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /* 1. Extract token from header or cookie */
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken as string | undefined) {
      token = req.cookies.accessToken as string;
    }

    if (!token) throw AppError.unauthorized("No token provided");

    /* 2. Verify token */
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    /* 3. Check user still exists */
    const user = await User.findById(decoded.id).select("_id email role").lean();
    if (!user) throw AppError.unauthorized("User no longer exists");

    /* 4. Attach to request */
    req.user = { id: String(user._id), email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
}

/* ── Restrict to specific roles ──────────────────────── */
export function restrictTo(...roles: Array<"customer" | "salon_owner" | "admin">) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(AppError.unauthorized()); return;
    }
    if (!roles.includes(req.user.role)) {
      next(AppError.forbidden("You do not have permission")); return;
    }
    next();
  };
}

/* ── Optional auth (attach user if token present) ─────── */
export async function optionalAuth(
  req:  Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) { next(); return; }

    const token   = authHeader.split(" ")[1];
    if (!token)   { next(); return; }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    const user    = await User.findById(decoded.id).select("_id email role").lean();
    if (user) req.user = { id: String(user._id), email: user.email, role: user.role };
  } catch {
    // Invalid token — treat as unauthenticated
  }
  next();
}