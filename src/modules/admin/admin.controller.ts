import * as AdminService from "./admin.service";
import { AuthRequest } from "../../middleware/authenticate.middleware";
import { Response, NextFunction } from "express";
import { AdminUpdateUserSchema } from "./admin.schema";

export async function listAllUsers(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!_req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const users = await AdminService.listAllUsers();
    return res.json({
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
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = Number(req.params.id);
    const data = AdminUpdateUserSchema.parse(req.body);
    const { updatedUser } = await AdminService.adminUpdateUser(userId, data);
    return res.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userIdToDelete = Number(req.params.id);
    const adminId = Number(req.user.id);
    if (userIdToDelete === adminId) {
      return res.status(400).json({ message: "Admin cannot delete self" });
    }

    const message = await AdminService.adminDeleteUser(userIdToDelete);
    return res.json({
      message: message,
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
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = Number(req.params.id);
    const user = await AdminService.getUserById(userId);
    return res.json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
