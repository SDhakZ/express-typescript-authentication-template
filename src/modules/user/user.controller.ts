import * as UserService from "./user.service";
import { AuthRequest } from "../../middleware/authenticate.middleware";
import { Response, NextFunction } from "express";

export async function getUserProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userId = Number(req.user.id);
    const user = await UserService.getUserProfile(userId);
    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function listAllUsers(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!_req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const users = await UserService.listAllUsers();
    return res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}
