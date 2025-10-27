import prisma from "../../config/prisma";
import { createError } from "../../utils/errors";
import { AdminUpdateUserInput } from "./admin.schema";

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
  if (!users) {
    throw createError({
      message: "No users found",
      status: 404,
      code: "USERS_NOT_FOUND",
    });
  }
  return users;
}

export async function adminUpdateUser(
  userId: number,
  data: AdminUpdateUserInput
) {
  const oldUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!oldUser) {
    throw createError({
      message: "User not found",
      status: 404,
      code: "USER_NOT_FOUND",
    });
  }

  const updatedUser = await prisma.user.update({
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

  if (data.role && data.role !== oldUser.role) {
    await prisma.refreshToken.deleteMany({
      where: { userId: userId },
    });
  }

  return { updatedUser };
}

export async function getUserById(userId: number) {
  console.log("getUserById called with:", userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
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
