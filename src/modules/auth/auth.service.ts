import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { LoginInput, RegisterInput } from "./auth.schemas";
import { ENV } from "../../config/env";
import { createError } from "../../utils/errors";
import { Role } from "@prisma/client";

export async function register(data: RegisterInput) {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      message: "User already exists",
      code: "USER_EXISTS",
      status: 400,
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });
  return { id: user.id, email: user.email, name: user.name };
}
export async function login(data: LoginInput) {
  const { email, password, rememberMe } = data;

  const userRecord = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });
  if (!userRecord) {
    throw createError({
      message: "Invalid email or password",
      code: "USER_NOT_FOUND",
      status: 401,
    });
  }
  const passwordValid = await bcrypt.compare(password, userRecord.passwordHash);
  if (!passwordValid) {
    throw createError({
      message: "Invalid email or password",
      code: "INVALID_PASSWORD",
      status: 401,
    });
  }
  const days = rememberMe ? 30 : 7;
  const { passwordHash, ...safeUser } = userRecord;
  const accessToken = generateAccessToken(userRecord);
  const refreshToken = await generateRefreshToken(userRecord.id, days);
  return { user: safeUser, accessToken, refreshToken };
}

export async function refreshToken(oldToken: string) {
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

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}

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
