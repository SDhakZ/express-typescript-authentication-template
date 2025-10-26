import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate.middleware";
import { createError } from "../utils/errors";

export function authorize(roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw createError({ message: "Unauthorized", status: 401 });
    }

    if (!roles.includes(req.user.role || "")) {
      throw createError({ message: "Forbidden", status: 403 });
    }

    next();
  };
}
