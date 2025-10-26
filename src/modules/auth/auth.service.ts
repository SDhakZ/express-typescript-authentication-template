import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginInput, RegisterInput } from "./auth.schemas";
import { ENV } from "../../config/env";
import { createError } from "../../utils/errors";

export async function registerUser(data: RegisterInput) {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError("User already exists", 400);
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
export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw createError("Invalid email or password", 401);
  }
  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    throw createError("Invalid email or password", 401);
  }
  const token = jwt.sign({ id: user.id, email: user.email }, ENV.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token };
}
