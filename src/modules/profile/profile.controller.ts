import { ChangePasswordSchema } from "./profile.schema";
import { changePassword } from "./profile.service";
import type { ChangePasswordInput } from "./profile.schema";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/authenticate.middleware";
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
