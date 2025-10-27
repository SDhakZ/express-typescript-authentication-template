import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
  const { email, password } = data;

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
  const { passwordHash, ...safeUser } = userRecord;
  const token = generateToken(userRecord);
  return { user: safeUser, token };
}

export function generateToken(user: { id: number; email: string; role: Role }) {
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
