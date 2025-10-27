import prisma from "../../config/prisma";
import { createError } from "../../utils/errors";
import { Role } from "@prisma/client";
import { UpdateUserInput, AdminUpdateUserInput } from "./user.schema";
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
      code: "USER_NOT_FOUND",
    });
  }
  return user;
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

  const roleChanged = data.role && data.role !== oldUser.role;

  return { updatedUser, roleChanged };
}
