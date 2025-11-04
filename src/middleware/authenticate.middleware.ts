import * as jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/errors";
export interface AuthRequest extends Request {
  user?: { id: string; email: string; role?: string };
}

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw createError({ message: "Authorization header missing", status: 401 });
  }

  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    throw createError({ message: "Access Token missing", status: 401 });
  }

  try {
    const decoded = jwt.verify(accessToken, ENV.JWT_SECRET) as {
      id: string;
      email: string;
      role?: string;
      iat: number;
      exp: number;
    };
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    throw createError({
      message: "Invalid or expired Access Token",
      status: 401,
    });
  }
}
