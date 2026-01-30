import { z } from "zod";

export const newUserEntrySchema = z.object({
  email: z.email("Invalid email!"),
  password: z
    .string()
    .min(8, "Password is too short, legth must be at least 8 characters long")
    .max(30, "Password is too long, length must be at most 30 characters!"),
});
