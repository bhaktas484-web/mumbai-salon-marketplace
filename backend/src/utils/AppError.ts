export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(
    message:        string,
    statusCode      = 500,
    errors?:        unknown,
    isOperational   = true
  ) {
    super(message);
    this.name          = "AppError";
    this.statusCode    = statusCode;
    this.isOperational = isOperational;
    this.errors        = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  /* ── Factory helpers ─────────────────────────────── */
  static badRequest(message: string, errors?: unknown) {
    return new AppError(message, 400, errors);
  }
  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }
  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }
  static notFound(resource = "Resource") {
    return new AppError(`${resource} not found`, 404);
  }
  static conflict(message: string) {
    return new AppError(message, 409);
  }
  static tooManyRequests(message = "Too many requests") {
    return new AppError(message, 429);
  }
  static internal(message = "Internal server error") {
    return new AppError(message, 500, undefined, false);
  }
}