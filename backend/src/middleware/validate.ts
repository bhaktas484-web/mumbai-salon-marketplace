import type { Request, Response, NextFunction } from "express";
import { z, type ZodSchema } from "zod";
import { AppError } from "../utils/AppError";

type Target = "body" | "query" | "params";

/* ── Validate middleware factory ─────────────────────── */
export function validate(schema: ZodSchema, target: Target = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      next(AppError.badRequest("Validation failed", errors));
      return;
    }

    // Attach parsed & coerced data back to request
    (req as Request & { [key: string]: unknown })[target] = result.data;
    next();
  };
}

/* ── Common Zod schemas ──────────────────────────────── */
export const schemas = {
  mongoId: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID"),
  }),

  pagination: z.object({
    page:     z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(12),
    sortBy:   z.enum(["rating","price_asc","price_desc","distance","newest"]).optional(),
  }),

  slug: z.object({
    slug: z.string().min(1),
  }),
};