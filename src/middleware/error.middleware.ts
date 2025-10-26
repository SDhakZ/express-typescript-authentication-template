// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { z } from "zod";

interface AppErrorOptions {
  message: string;
  status?: number;
  details?: unknown;
}

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

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle Zod validation errors cleanly
  if (err instanceof ZodError) {
    err = err.issues.map((e: any) => ({
      field: e.path[0],
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: err,
    });
  }

  // Handle known AppError instances
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // ❌ Handle unknown/unexpected errors
  console.error("💥 Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
