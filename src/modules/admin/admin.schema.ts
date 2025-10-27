import z from "zod";
import { Role } from "@prisma/client";

export const AdminUpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.email().optional(),
  role: z.enum(Role).optional(),
});

export type AdminUpdateUserInput = z.infer<typeof AdminUpdateUserSchema>;
