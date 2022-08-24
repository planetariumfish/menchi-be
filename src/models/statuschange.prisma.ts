import { Status } from "@prisma/client";
import prisma from "./prismaClient";

export const getUserPets = (userId: string) => {
  // get all status changes for user id
  // get the unique adopted/fostered petIDs that match the userID that don't have a more recent "AVAILABLE" status
  // ^ review the logic above
};

export const getStatusChangeById = (id: string) => {
  // just query for the record by ID
};

export const writeStatusChange = (
  userId: string,
  petId: string,
  newStatus: Status
) => {
  // write new record to database with this
};
