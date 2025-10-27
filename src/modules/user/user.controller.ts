import * as UserService from "./user.service";
import { AuthRequest } from "../../middleware/authenticate.middleware";
import { Response, NextFunction } from "express";
import { UpdateUserSchema } from "./user.schema";

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
    return res.json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userId = Number(req.user.id);
    const data = UpdateUserSchema.parse(req.body);
    const user = await UserService.updateProfile(userId, data);
    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
