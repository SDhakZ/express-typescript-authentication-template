import * as AdminService from "./admin.service";
import { AuthRequest } from "../../middleware/authenticate.middleware";
import { Response, NextFunction } from "express";
import { AdminUpdateUserSchema } from "./admin.schema";
import { generateToken } from "../auth/auth.service";

export async function listAllUsers(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!_req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const users = await AdminService.listAllUsers();
    return res.json({
      success: true,
      message: "All users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userId = Number(req.params.id);
    const data = AdminUpdateUserSchema.parse(req.body);
    const { updatedUser, roleChanged } = await AdminService.adminUpdateUser(
      userId,
      data
    );
    let newToken: string | undefined = undefined;
    if (roleChanged) {
      newToken = generateToken(updatedUser);
    }
    return res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
      ...(newToken ? { token: newToken } : {}),
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userId = Number(req.params.id);
    const user = await AdminService.getUserById(userId);
    return res.json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
