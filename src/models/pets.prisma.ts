import { AnimalType, Pet, Status } from "@prisma/client";
import { NewPet } from "../types/types";
import prisma from "./prismaClient";

export async function getAllPets() {
  const allPets = await prisma.pet.findMany();
  return allPets;
}

export async function addPet(pet: NewPet) {
  // Postgres is case sensitive and Prisma doesn't have mode: 'insensitive' for "hasSome", so lowercasing tags and dietary array values
  const lowerCasePet: NewPet = pet;
  if (lowerCasePet.dietary)
    lowerCasePet.dietary = lowerCasePet.dietary.map((e: string) =>
      e.toLowerCase()
    );
  if (lowerCasePet.tags)
    lowerCasePet.tags = lowerCasePet.tags.map((e: string) => e.toLowerCase());
  const newPet = await prisma.pet.create({ data: lowerCasePet });
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

export async function getPetsByType(type: AnimalType) {
  const pets = await prisma.pet.findMany({
    where: {
      type,
    },
  });
  return pets;
}

export async function getUserPets(id: string) {
  const pets = await prisma.pet.findMany({
    where: {
      userId: id,
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

export async function updatePetStatus(
  id: string,
  status: Status,
  userId: string | null
) {
  const updatedPet = await prisma.pet.update({
    where: {
      id,
    },
    data: { status, userId: status === Status.AVAILABLE ? null : userId },
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

// using "any" here because, well, yeah
export async function getPetsBySearch(queryParams: Record<string, any>) {
  // build search object
  let fuzzyTerms = queryParams.query ? queryParams.query.split(",") : [];
  fuzzyTerms = fuzzyTerms.map((e: string) => (e = e.toLowerCase().trim()));
  const searchList = fuzzyTerms
    .map((e: string) => (e = `"${e.split(" ").join(" & ")}"`))
    .join(" | ");

  const searchObj: Record<string, any> = {};
  if (queryParams.animalType) searchObj.type = queryParams.animalType;
  if (queryParams.height)
    searchObj.height = {
      gte: +queryParams.height[0],
      lte: +queryParams.height[1],
    };
  if (queryParams.weight)
    searchObj.weight = {
      gte: +queryParams.weight[0],
      lte: +queryParams.weight[1],
    };
  if (queryParams.status) searchObj.status = queryParams.status;
  if (fuzzyTerms.length > 0)
    searchObj.OR = [
      { tags: { hasSome: fuzzyTerms } },
      { dietary: { hasSome: fuzzyTerms } },
      { name: { search: searchList, mode: "insensitive" } },
      { color: { search: searchList, mode: "insensitive" } },
      { breed: { search: searchList, mode: "insensitive" } },
    ];

  // run the search
  const pets = await prisma.pet.findMany({
    where: searchObj,
  });
  return pets;
}
