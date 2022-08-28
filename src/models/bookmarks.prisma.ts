import prisma from "./prismaClient";
import { Bookmarks } from "@prisma/client";

export const getUserBookmarks = async (userId: string) => {
  try {
    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        userId,
      },
    });
    return bookmarks;
  } catch (err) {
    console.log(err);
  }
};

export const getPetBookmarks = async (petId: string) => {
  try {
    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        petId,
      },
    });
    return bookmarks;
  } catch (err) {
    console.log(err);
  }
};

export const addBookmark = async (userId: string, petId: string) => {
  try {
    const bookmark = await prisma.bookmarks.create({ data: { userId, petId } });
    return bookmark;
  } catch (err) {
    console.log(err);
  }
};

export const deleteBookmark = async (userId: string, petId: string) => {
  try {
    const bookmark = await prisma.bookmarks.delete({
      where: { userId_petId: { userId, petId } },
    });
    return bookmark;
  } catch (err) {
    console.log(err);
  }
};
