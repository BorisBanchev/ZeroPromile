import { z } from "zod";

export const newSessionSchema = z.object({
  name: z.string("Session's name must be a string"),
});
