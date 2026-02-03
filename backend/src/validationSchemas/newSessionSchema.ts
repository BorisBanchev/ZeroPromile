import { z } from "zod";

export const newSessionSchema = z.object({
  sessionName: z.string().min(1, "Session name is required"),
  drink: z.object({
    name: z.string().min(1, "Drink name is required"),
    volumeMl: z
      .number()
      .positive("Drink amount in Ml must be a positive number"),
    abv: z
      .number()
      .gt(0, "Drink abv must be greater than 0")
      .lte(100, "Drink abv must be at most 100"),
  }),
});
