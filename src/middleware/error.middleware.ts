import { Request, Response, NextFunction } from "express";

interface AppErrorOptions {
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * Custom AppError class
 * ---------------------
 * Lets you throw meaningful errors from anywhere:
 *   throw new AppError("User not found", 404);
 */
export class AppError extends Error {
  status: number;
  details?: unknown;

  constructor({ message, status = 500, details }: AppErrorOptions) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global Express error handler
 * ----------------------------
 * Must be the *last* middleware registered in app.ts
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle known AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Handle unexpected errors
  console.error("💥 Unhandled error:", err);
  return res.status(500).json({ error: "Internal Server Error" });
}
