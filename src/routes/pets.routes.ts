import express from "express";
import {
  addPet,
  getAllPets,
  getPetbyID,
  getPetsbyType,
  updatePet,
  updatePetPhoto,
  updatePetStatus,
  getUserPets,
} from "../models/pets.prisma";
import auth from "../middleware/auth";
import { upload } from "../middleware/multer";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary";
import {
  addBookmark,
  deleteBookmark,
  getPetBookmarks,
  getUserBookmarks,
} from "../models/bookmarks.prisma";
import { writeStatusChange } from "../models/statuschange.prisma";
import { AnimalType, Pet } from "@prisma/client";

const router = express.Router();

// TODO: finish search functionality
router.get("/", async (req, res) => {
  const { animalType, status, height, weight, name, advanced } = req.query;
  // console.log(req.query);
  try {
    let pets: Pet[] = [];
    if (advanced === "false") {
      pets = animalType
        ? await getPetsbyType(animalType as AnimalType)
        : await getAllPets();
    }
    // advanced search goes here
    res.status(200).send({ ok: true, pets });
  } catch (err) {
    res.status(500).send({ ok: false, message: "Something went wrong." });
  }
});

// get a user's adopted/fostered pets
router.get("/user/:id", auth, async (req, res) => {
  const { id } = req.params;
  const pets = await getUserPets(id);
  res.status(200).send({ ok: true, pets });
});

router.get("/all", async (req, res) => {
  const allPets = await getAllPets();
  res.status(200).send(allPets);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const pet = await getPetbyID(id);
  res.status(200).send(pet);
});

router.post("/", async (req, res) => {
  const petIds = req.body;
  const results = [];
  for (const id of petIds) {
    const pet = await getPetbyID(id);
    results.push(pet);
  }
  res.status(200).send(results);
});

router.post("/add", async (req, res) => {
  const newPet = req.body;
  const pet = await addPet(newPet);
  res.status(200).send({ ok: true, message: "Pet added.", id: pet.id });
});

router.post(
  "/upload",
  upload.single("petphoto"),
  uploadToCloudinary,
  async (req, res) => {
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
  }
);

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  const pet = await updatePet(id, newData);
  res.status(200).send(pet);
});

// adopt/foster pet
router.post("/:id/adopt", auth, async (req, res) => {
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
});

// like and unlike pet
router
  .route("/:id/save")
  .post(auth, async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.body.user;
    const bookmark = await addBookmark(userId, id);
    res.status(200).send({ ok: true, message: "Pet saved to favorites." });
  })
  .delete(auth, async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.body.user;
    const bookmark = await deleteBookmark(userId, id);
    res.status(200).send({ ok: true, message: "Pet removed from favorites." });
  });

router.get("/:id/likes", async (req, res) => {
  const { id } = req.params;
  const bookmarks = await getPetBookmarks(id);
  const likes = bookmarks ? bookmarks.length : 0;
  res.status(200).send({ ok: true, likes });
});

router.get("/user/:id/saved", async (req, res) => {
  const { id } = req.params;
  const bookmarks = await getUserBookmarks(id);
  const petIds: string[] = [];
  if (bookmarks) bookmarks.forEach((e) => petIds.push(e.petId));
  res.send(petIds);
});

export default router;
