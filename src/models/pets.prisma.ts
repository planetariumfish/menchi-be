import { AnimalType, Pet, Status } from "@prisma/client";
import { NewPet } from "../types/types";
import prisma from "./prismaClient";

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

// Why does this throw an error?

export async function updatePet(id: string, data: Pet) {
  const updatePet = await prisma.pet.update({
    where: {
      id,
    },
    data,
  });
  return updatePet;
}

export async function updatePetStatus(id: string, status: Status) {
  const updatedPet = await prisma.pet.update({
    where: {
      id,
    },
    data: { status },
  });
  return updatedPet;
}

export async function updatePetPhoto(id: string, picture: string) {
  const updatedPet = await prisma.pet.update({
    where: {
      id,
    },
    data: { picture },
  });
  return updatedPet;
}
