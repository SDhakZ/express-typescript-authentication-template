import prisma from "../../config/prisma";
import { createError } from "../../utils/errors";

export async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  if (!user) {
    throw createError({
      message: "User not found",
      status: 404,
      code: "USER_NOT_FOUND",
    });
  }
  return user;
}

export async function listAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
}
