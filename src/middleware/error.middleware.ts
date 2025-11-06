// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    const details = err.issues.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      details,
    });
  }

  // Custom functional errors
  if (err.isCustom) {
    return res.status(err.status || 500).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
      ...(err.code ? { code: err.code } : {}),
      ...(err.meta ? { meta: err.meta } : {}),
    });
  }

  // Fallback for unexpected errors
  console.error("💥 Unhandled error:", err);
  return res.status(500).json({
    message: "Internal Server Error",
  });
}
