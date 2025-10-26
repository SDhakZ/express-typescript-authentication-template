import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate.middleware";
import { createError } from "../utils/errors";
import { Role } from "@prisma/client";

export function authorize(roles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw createError({ message: "Unauthorized", status: 401 });
    }

    if (!roles.includes(req.user.role as Role)) {
      throw createError({ message: "Forbidden", status: 403 });
    }

    next();
  };
}
