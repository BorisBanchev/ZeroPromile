import { z } from "zod";
import { Gender } from "../types/user";

export const newUpdateProfileSchema = z.object({
  gender: z.enum(Gender, "Invalid gender: Must be either male or female"),
  weight: z
    .number("Weight must be a number")
    .min(0, "Weight must be positive number")
    .max(1000, "Weight must be under 1000"),
});
