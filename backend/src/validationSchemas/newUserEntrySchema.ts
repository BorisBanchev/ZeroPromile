import { z } from "zod";

export const newUserEntrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email!"),
  password: z
    .string()
    .min(8, "Password is too short, legth must be at least 8 characters long")
    .max(30, "Password is too long, length must be at most 30 characters!"),
  gender: z.enum(
    ["male", "female"],
    "Invalid gender: must be either male or female",
  ),
  weightKg: z
    .number("Weight must be a positive number")
    .positive("Weight must be a positive number"),
});
