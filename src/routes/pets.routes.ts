import express from "express";
import { addPet, getPetbyID, updatePet } from "../models/pets.prisma";

const router = express.Router();

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

export default router;
