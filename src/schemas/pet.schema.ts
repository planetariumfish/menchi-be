import { AnimalType } from "@prisma/client";
import { z } from "zod";

export const newPetSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(AnimalType),
  breed: z.string(),
  height: z.number(),
  weight: z.number(),
  color: z.string(),
  bio: z.string().optional(),
  hypoallergenic: z.boolean(),
  dietary: z.array(z.string().optional()),
  tags: z.array(z.string().optional()),
});

export const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(AnimalType),
  breed: z.string(),
  height: z.number(),
  weight: z.number(),
  color: z.string(),
  picture: z.string(),
  bio: z.string().optional(),
  hypoallergenic: z.boolean(),
  dietary: z.array(z.string().optional()),
  tags: z.array(z.string().optional()),
  userId: z.string().optional(),
});
