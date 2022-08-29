import { Status } from "@prisma/client";
import prisma from "./prismaClient";

export const getStatusChangeById = async (id: string) => {
  // just query for the record by ID
};

export const writeStatusChange = async (
  userId: string,
  petId: string,
  newStatus: Status
) => {
  try {
    const status = await prisma.statusChange.create({
      data: { newStatus, petId, userId },
    });
  } catch (err) {
    console.log(err);
  }
};
