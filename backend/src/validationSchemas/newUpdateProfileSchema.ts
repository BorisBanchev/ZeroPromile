import { z } from "zod";
import { Gender } from "../types/user";

export const newUpdateProfileSchema = z.object({
  gender: z.enum(Gender, "Invalid gender: Must be either male or female"),
  weight: z.number().positive("Weight must be a positive number"),
});
