import z from "zod";

export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters long"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long"),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.email().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
