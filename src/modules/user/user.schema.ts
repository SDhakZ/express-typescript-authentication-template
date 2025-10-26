import z from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.email().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
