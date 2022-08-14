import { AnimalType } from "@prisma/client";

export type NewUser = {
  email: string;
  firstname: string;
  lastname?: string;
  password: string;
};

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
