import { AnimalType, Pet } from "@prisma/client";
import { Request, Response } from "express";
import {
  getAllPets,
  getPetsBySearch,
  getPetsByType,
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
