import { ChangePasswordSchema, AddPasswordSchema } from "./profile.schema";
import { changePassword, addPassword } from "./profile.service";

import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/authenticate.middleware";
import * as UserService from "./profile.service";
import { UpdateUserSchema } from "./profile.schema";
export async function getUserProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = Number(req.user.id);
    const user = await UserService.getUserProfile(userId);
    return res.json({
      message: "User profile retrieved successfully",
      data: { user },
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
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = Number(req.user.id);
    const data = UpdateUserSchema.parse(req.body);
    const user = await UserService.updateProfile(userId, data);
    return res.json({
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function changePasswordHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const parsedData = ChangePasswordSchema.parse(req.body);
    const userId = Number(req.user.id);
    const message = await changePassword(userId, parsedData);
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function addPasswordHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const parsedData = AddPasswordSchema.parse(req.body);
    const userId = Number(req.user.id);
    const message = await addPassword(userId, parsedData);
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}
