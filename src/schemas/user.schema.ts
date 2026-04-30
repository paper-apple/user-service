import { z } from "zod";

export const userIdSchema = z.object({
  id: z.coerce.number({error: "Invalid user number"}).int().positive(),
});