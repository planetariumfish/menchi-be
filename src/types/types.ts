import { AnimalType } from "@prisma/client";
import { z } from "zod";
import { safeUserSchema } from "../schemas/user.schema";

export type NewUser = {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
};

export type SafeUser = z.infer<typeof safeUserSchema>;

export type NewPet = {
  name: string;
  type: AnimalType;
  breed: string;
  picture?: string;
  height: number;
  weight: number;
  color: string;
  bio?: string;
  hypoallergenic?: boolean;
  dietary?: string[];
  tags?: string[];
};
