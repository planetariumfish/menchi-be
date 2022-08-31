import { AnimalType, Status } from "@prisma/client";
import { z } from "zod";

export const advancedSearch = z.object({
  animalType: z.nativeEnum(AnimalType).or(z.string()),
  status: z.nativeEnum(Status).or(z.string()).optional(),
  advanced: z.string(),
  height: z.tuple([z.string(), z.string()]).optional(),
  weight: z.tuple([z.string(), z.string()]).optional(),
  query: z.string().optional(),
});
