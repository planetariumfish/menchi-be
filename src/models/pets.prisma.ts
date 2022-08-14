import { AnimalType, Pet, PrismaClient } from "@prisma/client";
import { NewPet } from "../types/types";

const prisma = new PrismaClient();

export async function getAllPets() {
  const allPets = await prisma.pet.findMany();
  return allPets;
}

export async function addPet(pet: NewPet) {
  const newPet = await prisma.pet.create({ data: pet });
  return newPet;
}

export async function getPetbyID(id: string) {
  const user = await prisma.pet.findUnique({
    where: {
      id,
    },
  });
  return user;
}

export async function getPetsbyType(type: AnimalType) {
  const pets = await prisma.pet.findMany({
    where: {
      type,
    },
  });
  return pets;
}

export async function updatePet(id: string, data: Pet) {
  const updatePet = await prisma.pet.update({
    where: {
      id,
    },
    data,
  });
  return updatePet;
}
