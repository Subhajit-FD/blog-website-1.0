import { z } from "zod";

export const registerSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
