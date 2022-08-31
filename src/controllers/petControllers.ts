import { AnimalType, Pet } from "@prisma/client";
import { Request, Response } from "express";
import {
  getAllPets,
  getPetbyID,
  getPetsBySearch,
  getPetsByType,
  getUserPets,
  updatePetPhoto,
} from "../models/pets.prisma";

export const searchForPets = async (req: Request, res: Response) => {
  const { animalType, advanced } = req.query;
  try {
    let pets: Pet[] = [];
    if (advanced === "false") {
      pets = animalType
        ? await getPetsByType(animalType as AnimalType)
        : await getAllPets();
    } else {
      pets = await getPetsBySearch(req.query);
    }
    res.status(200).send({ ok: true, pets });
  } catch (err) {
    res.status(500).send({ ok: false, message: "Something went wrong." });
  }
};

export const getUserOwnedPets = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pets = await getUserPets(id);
  res.status(200).send({ ok: true, pets });
};

export const getSomePets = async (req: Request, res: Response) => {
  const petIds = req.body;
  const results = [];
  for (const id of petIds) {
    const pet = await getPetbyID(id);
    results.push(pet);
  }
  res.status(200).send(results);
};

export const addPetPhoto = async (req: Request, res: Response) => {
  const { id, photo } = req.body;
  const pet = await getPetbyID(id);
  if (!pet) {
    res.status(404).send({ ok: false, message: "Pet not found" });
    return;
  }
  try {
    const updatedPet = await updatePetPhoto(id, photo);
    if (updatedPet)
      res.status(200).send({ ok: true, message: "Photo uploaded!" });
  } catch (err) {
    res.status(500).send(err);
  }
};
