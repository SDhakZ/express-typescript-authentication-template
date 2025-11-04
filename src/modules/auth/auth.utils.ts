import bcrypt, { compare } from "bcrypt";
import crypto from "crypto";

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePasswords(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return compare(password, passwordHash);
}
