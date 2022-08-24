import express from "express";
import { addPet, getPetbyID, updatePet } from "../models/pets.prisma";
import auth from "../middleware/auth";

const router = express.Router();

// TODO: finish search functionality
router.get("/", async (req, res) => {
  const { animalType, status, height, weight, name, advanced } = req.query;
  console.log(req.query);
  // call a model here
  res.status(200).send("Got your query! Will deal with it soon...");
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const pet = await getPetbyID(id);
  res.status(200).send(pet);
});

router.post("/add", async (req, res) => {
  const newPet = req.body;
  const pet = await addPet(newPet);
  res.status(200).send(pet);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  const pet = await updatePet(id, newData);
  res.status(200).send(pet);
});

// like and unlike pet
router
  .route("/:id/save")
  .post(async (req, res) => {
    const { id } = req.params;
    // get user ID from cookies
    // add petid, userid to bookmarks table
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    // get user ID from cookies
    // delete composite key in bookmarks table
  });

router.post("/:id/:statuschange", auth, async (req, res) => {
  const { id, statuschange } = req.params;
  // add record to statuschange table
});

// get a user's adopted/fostered pets
router.get("/user/:id", auth, async (req, res) => {
  const { id } = req.params;
  // look in statuschange table by userid and get the most recent fostered and adopted records
});

export default router;
