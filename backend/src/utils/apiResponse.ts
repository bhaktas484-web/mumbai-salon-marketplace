import type { Response } from "express";

/* ── Types ───────────────────────────────────────────── */
interface SuccessPayload<T> {
  success: true;
  message: string;
  data:    T;
  meta?:   Record<string, unknown>;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors?: unknown;
  stack?:  string;
}

/* ── Success ─────────────────────────────────────────── */
export function sendSuccess<T>(
  res:     Response,
  data:    T,
  message  = "Success",
  status   = 200,
  meta?:   Record<string, unknown>
): Response {
  const payload: SuccessPayload<T> = { success: true, message, data, ...(meta ? { meta } : {}) };
  return res.status(status).json(payload);
}

/* ── Created ─────────────────────────────────────────── */
export function sendCreated<T>(res: Response, data: T, message = "Created"): Response {
  return sendSuccess(res, data, message, 201);
}

/* ── No content ──────────────────────────────────────── */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

/* ── Error ───────────────────────────────────────────── */
export function sendError(
  res:     Response,
  message: string,
  status   = 500,
  errors?: unknown
): Response {
  const payload: ErrorPayload = { success: false, message, ...(errors ? { errors } : {}) };
  return res.status(status).json(payload);
}

/* ── Paginated ───────────────────────────────────────── */
export function sendPaginated<T>(
  res:      Response,
  data:     T[],
  total:    number,
  page:     number,
  pageSize: number,
  message = "Success"
): Response {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore:    page * pageSize < total,
    },
  });
}