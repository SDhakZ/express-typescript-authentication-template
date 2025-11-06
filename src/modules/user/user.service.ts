import prisma from "../../config/prisma";
import { createError } from "../../utils/errors";
import { UpdateUserInput } from "./user.schema";
export async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
