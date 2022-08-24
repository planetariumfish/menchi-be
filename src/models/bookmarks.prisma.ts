import prisma from "./prismaClient";
import { Bookmarks } from "@prisma/client";

export const getUserBookmarks = (userId: string) => {
  // get stuff here
};

export const getPetBookmarks = (petId: string) => {
  // get stuff here
};

export const addBookmark = (userId: string, petId: string) => {
  // write to database here
};

export const deleteBookmark = (userId: string, petId: string) => {
  // delete from database here
};
