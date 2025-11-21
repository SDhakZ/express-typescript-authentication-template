import prisma from "../../config/prisma";
import { createError } from "../../utils/errors";
import type { ChangePasswordInput } from "./profile.schema";
import { hashPassword, comparePasswords } from "../auth/auth.utils";
import { UpdateUserInput } from "./profile.schema";
export async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw createError({
      message: "User not found",
      status: 404,
    });
  }

  const hasPassword = user.passwordHash !== null;

  const { passwordHash, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, hasPassword };
}

export async function updateProfile(userId: number, data: UpdateUserInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw createError({
      message: "User not found",
      status: 404,
    });
  }
  return user;
}

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

  if (!user.passwordHash) {
    throw createError({
      message:
        "This account was created with Google. Password change not allowed.",
      status: 400,
    });
  }

  const isValid = await comparePasswords(currentPassword, user.passwordHash);
  if (!isValid) {
    throw createError({
      message: "You have entered invalid current password",
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
