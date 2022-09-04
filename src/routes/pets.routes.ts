import express from "express";
import { getAllPets, getPetbyID } from "../models/pets.prisma";
import auth from "../middleware/auth";
import { upload } from "../middleware/multer";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary";
import searchFilter from "../middleware/searchFilter";
import {
  addNewPet,
  addPetPhoto,
  adoptOrFosterPet,
  getLikedPetIds,
  getLikes,
  getSomePets,
  getUserOwnedPets,
  likeAPet,
  returnAPet,
  searchForPets,
  unlikeAPet,
  updatePetInfo,
} from "../controllers/petControllers";
import isAdmin from "../middleware/isAdmin";
import validate from "../middleware/validate";
import { newPetSchema, PetSchema } from "../schemas/pet.schema";
import removeUserFromBody from "../middleware/removeUserFromBody";

const router = express.Router();

router.get("/", searchFilter, searchForPets);

// get a user's adopted/fostered pets
router.get("/user/:id", auth, getUserOwnedPets);

router.get("/all", async (req, res) => {
  const allPets = await getAllPets();
  res.status(200).send(allPets);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const pet = await getPetbyID(id);
  res.status(200).send(pet);
});

// get some pets by id array
router.post("/", getSomePets);

router.post(
  "/add",
  validate(newPetSchema),
  auth,
  isAdmin,
  removeUserFromBody,
  addNewPet
);

router.post(
  "/upload",
  upload.single("petphoto"),
  uploadToCloudinary,
  addPetPhoto
);

router.put(
  "/:id",
  validate(PetSchema),
  auth,
  isAdmin,
  removeUserFromBody,
  updatePetInfo
);

// adopt/foster pet
router.post("/:id/adopt", auth, adoptOrFosterPet);

router.put("/:id/return", auth, returnAPet);

// like and unlike pet
router.route("/:id/save").post(auth, likeAPet).delete(auth, unlikeAPet);

// returns the number of "likes" on a pet
router.get("/:id/likes", getLikes);

router.get("/user/:id/saved", getLikedPetIds);

export default router;
