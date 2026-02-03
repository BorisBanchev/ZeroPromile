import { z } from "zod";

export const newDrinkSchema = z.object({
  drink: z.object({
    name: z
      .string("Drink name must be a string")
      .min(1, "Drink name is required"),
    volumeMl: z
      .number("Drink amount in Ml must be a positive number")
      .positive("Drink amount in Ml must be a positive number"),
    abv: z
      .number()
      .gt(0, "Drink abv must be greater than 0")
      .lte(100, "Drink abv must be at most 100"),
  }),
});
