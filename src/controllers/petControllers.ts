import { AnimalType, Pet, Status } from "@prisma/client";
import { Request, Response } from "express";
import {
  addBookmark,
  deleteBookmark,
  getPetBookmarks,
  getUserBookmarks,
} from "../models/bookmarks.prisma";
import {
  addPet,
  getAllPets,
  getPetbyID,
  getPetsBySearch,
  getPetsByType,
  getUserPets,
  updatePet,
  updatePetPhoto,
  updatePetStatus,
} from "../models/pets.prisma";
import { writeStatusChange } from "../models/statuschange.prisma";
import { userReturningAdoptedPet } from "../models/users.prisma";

export const addNewPet = async (req: Request, res: Response) => {
  const newPet = req.body;
  const pet = await addPet(newPet);
  res.status(200).send({ ok: true, message: "Pet added.", id: pet.id });
};

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

export const adoptOrFosterPet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.body.user;
  const { status } = req.body;
  try {
    const newStatusResult = await writeStatusChange(userId, id, status);
    const updatedPet = await updatePetStatus(id, status, userId);
    res
      .status(200)
      .send({ ok: true, message: `Pet is now ${status.toLowerCase()}` });
  } catch (err) {
    console.log(err);
  }
};

export const updatePetInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newData = req.body;
  const pet = await updatePet(id, newData);
  res.status(200).send({ ok: true, message: "Pet information updated." });
};

export const returnAPet = async (req: Request, res: Response) => {
  const { id: userId } = req.body.user;
  const { id } = req.params;
  const pet = await getPetbyID(id);
  if (pet && pet.status === "ADOPTED") await userReturningAdoptedPet(userId);
  const updatedPet = await updatePetStatus(id, Status.AVAILABLE, null);
  const newHist = await writeStatusChange(userId, id, Status.AVAILABLE);
  res.status(200).send({ ok: true, message: "Pet has been returned." });
};

export const likeAPet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.body.user;
  const bookmark = await addBookmark(userId, id);
  res.status(200).send({ ok: true, message: "Pet saved to favorites." });
};

export const unlikeAPet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.body.user;
  const bookmark = await deleteBookmark(userId, id);
  res.status(200).send({ ok: true, message: "Pet removed from favorites." });
};

export const getLikes = async (req: Request, res: Response) => {
  const { id } = req.params;
  const bookmarks = await getPetBookmarks(id);
  const likes = bookmarks ? bookmarks.length : 0;
  res.status(200).send({ ok: true, likes });
};

export const getLikedPetIds = async (req: Request, res: Response) => {
  const { id } = req.params;
  const bookmarks = await getUserBookmarks(id);
  const petIds: string[] = [];
  if (bookmarks) bookmarks.forEach((e) => petIds.push(e.petId));
  res.send(petIds);
};
