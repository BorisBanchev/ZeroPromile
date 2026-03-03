import { z } from "zod";

export const newSessionSchema = z.object({
  sessionName: z.string().min(1, "Session name is required"),
});
