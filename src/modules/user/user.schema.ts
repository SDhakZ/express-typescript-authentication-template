import z from "zod";
import { Role } from "@prisma/client";

export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.email().optional(),
});

export const AdminUpdateUserSchema = UpdateUserSchema.extend({
  role: z.enum(Role).optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type AdminUpdateUserInput = z.infer<typeof AdminUpdateUserSchema>;
