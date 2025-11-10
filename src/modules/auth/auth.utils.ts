import bcrypt, { compare } from "bcrypt";
import { ENV } from "../../config/env";
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, Number(ENV.SALT_ROUNDS));
}

export function comparePasswords(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return compare(password, passwordHash);
}
