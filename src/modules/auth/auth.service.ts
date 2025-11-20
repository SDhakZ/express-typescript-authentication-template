import prisma from "../../config/prisma";
import { hashPassword, comparePasswords } from "./auth.utils";
import { LoginInput, RegisterInput } from "./auth.schemas";
import { createError } from "../../utils/errors";
import { generateAccessToken, generateRefreshToken } from "./token.service";

export async function register(data: RegisterInput) {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      message: "User already exists",
      status: 400,
    });
  }

  const passwordHash = await hashPassword(password);

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
      status: 401,
    });
  }
  if (!userRecord.passwordHash) {
    throw createError({
      message:
        "This account was created with Google. Please continue with Google Login.",
      status: 400,
    });
  }
  const passwordValid = await comparePasswords(
    password,
    userRecord.passwordHash
  );
  if (!passwordValid) {
    throw createError({
      message: "Invalid email or password",
      status: 401,
    });
  }
  const days = rememberMe ? 30 : 7;
  const { passwordHash, ...safeUser } = userRecord;
  const accessToken = generateAccessToken(userRecord);
  const refreshToken = await generateRefreshToken(userRecord.id, days);
  return { user: safeUser, accessToken, refreshToken };
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}
