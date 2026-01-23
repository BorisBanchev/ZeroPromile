import { z } from "zod";
import { Gender } from "../types/user";

export const newGenderEntrySchema = z.object({
  gender: z.enum(Gender),
});
