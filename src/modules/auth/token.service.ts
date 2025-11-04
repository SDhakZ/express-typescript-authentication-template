import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import prisma from "../../config/prisma";
import { ENV } from "../../config/env";
import { Role } from "@prisma/client";
import { createError } from "../../utils/errors";

export function generateAccessToken(user: {
  id: number;
  email: string;
  role: Role;
}) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    ENV.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
}
export async function generateRefreshToken(userId: number, days: number = 7) {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
}

export async function validateRefreshToken(oldToken: string) {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
    select: {
      userId: true,
      expiresAt: true,
    },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw createError({
      message: "Invalid or expired refresh token",
      code: "INVALID_TOKEN",
      status: 401,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: storedToken.userId },
  });

  if (!user) {
    throw createError({
      message: "User not found",
      code: "USER_NOT_FOUND",
      status: 404,
    });
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user.id);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
