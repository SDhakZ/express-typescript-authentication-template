import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client/extension";

export async function seedUsers(prisma: PrismaClient) {
  const salt = bcrypt.genSaltSync(8);
  const pass = bcrypt.hashSync("123456789", salt);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@admin.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      passwordHash: pass,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: "user@user.com",
    },
    update: {},
    create: {
      name: "User",
      email: "user@user.com",
      passwordHash: pass,
      role: "USER",
    },
  });
  console.log("Seeded users: ", { admin, user });
}
