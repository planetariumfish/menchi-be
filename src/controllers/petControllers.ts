import { AnimalType, Pet, Status } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
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

export const addNewPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newPet = req.body;
  try {
    const pet = await addPet(newPet);
    if ("error" in pet) throw new Error(pet.error as string);
    res.status(200).send({ ok: true, message: "Pet added.", id: pet.id });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const searchForPets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { animalType, advanced } = req.query;
  try {
    let pets;
    if (advanced === "false") {
      pets = animalType
        ? await getPetsByType(animalType as AnimalType)
        : await getAllPets();
    } else {
      pets = await getPetsBySearch(req.query);
    }
    if ("error" in pets) throw new Error(pets.error as string);
    res.status(200).send({ ok: true, pets });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const getUserOwnedPets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const pets = await getUserPets(id);
    res.status(200).send({ ok: true, pets });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const getSomePets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const petIds = req.body;
  const results = [];
  try {
    for (const id of petIds) {
      const pet = await getPetbyID(id);
      results.push(pet);
    }
    res.status(200).send(results);
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const addPetPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const adoptOrFosterPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.body.user;
  const { status } = req.body;
  try {
    const newStatusResult = await writeStatusChange(userId, id, status);
    const updatedPet = await updatePetStatus(id, status, userId);
    res
      .status(200)
      .send({ ok: true, message: `Pet is now ${status.toLowerCase()}` });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const updatePetInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const newData = req.body;
  try {
    const pet = await updatePet(id, newData);
    res.status(200).send({ ok: true, message: "Pet information updated." });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const returnAPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.body.user;
  const { id } = req.params;
  try {
    const pet = await getPetbyID(id);
    if (pet && "error" in pet) throw new Error(pet.error as string);
    if (pet && pet.status === "ADOPTED") await userReturningAdoptedPet(userId);
    const updatedPet = await updatePetStatus(id, Status.AVAILABLE, null);
    const newHist = await writeStatusChange(userId, id, Status.AVAILABLE);
    res.status(200).send({ ok: true, message: "Pet has been returned." });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const likeAPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.body.user;
  try {
    const bookmark = await addBookmark(userId, id);
    res.status(200).send({ ok: true, message: "Pet saved to favorites." });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const unlikeAPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.body.user;
  try {
    const bookmark = await deleteBookmark(userId, id);
    res.status(200).send({ ok: true, message: "Pet removed from favorites." });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const getLikes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const bookmarks = await getPetBookmarks(id);
    if ("error" in bookmarks) throw new Error(bookmarks.error as string);
    const likes = bookmarks ? bookmarks.length : 0;
    res.status(200).send({ ok: true, likes });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const getLikedPetIds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const bookmarks = await getUserBookmarks(id);
    if ("error" in bookmarks) throw new Error(bookmarks.error as string);
    const petIds: string[] = [];
    if (bookmarks) bookmarks.forEach((e) => petIds.push(e.petId));
    res.send(petIds);
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};
