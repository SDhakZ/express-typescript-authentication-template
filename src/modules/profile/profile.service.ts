import prisma from "../../config/prisma";
import { createError } from "../../utils/errors";
import type { ChangePasswordInput } from "./profile.schema";
import { hashPassword, comparePasswords } from "../auth/auth.utils";

export async function changePassword(
  userId: number,
  data: ChangePasswordInput
) {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    throw createError({ message: "No user found", status: 404 });
  }

  // Verify current password
  const isValid = await comparePasswords(currentPassword, user.passwordHash);
  if (!isValid) {
    throw createError({
      message: "You have entered invalid password",
      status: 400,
    });
  }

  if (currentPassword === newPassword) {
    throw createError({
      message: "New password must be different from the current password",
      status: 400,
    });
  }

  const newHashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHashedPassword },
  });

  return "Password changed successfully";
}
