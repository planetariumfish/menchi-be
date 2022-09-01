import { User } from "@prisma/client";
import { NewUser } from "../types/types";
import prisma from "./prismaClient";

export async function getAllUsers() {
  try {
    const allUsers = await prisma.user.findMany();
    return allUsers;
  } catch (err) {
    return { error: err };
  }
}

export async function addUser(user: NewUser) {
  try {
    const newUser = await prisma.user.create({ data: user });
    return newUser;
  } catch (err) {
    return { error: err };
  }
}

export async function getUserbyEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
    return user;
  } catch (err) {
    return { error: err };
  }
}

export async function getUserbyID(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (err) {
    return { error: err };
  }
}

export async function updateUser(id: string, data: User) {
  try {
    const updateUser = await prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return updateUser;
  } catch (err) {
    return { error: err };
  }
}

export async function updateUserPhoto(id: string, photo: string) {
  try {
    const updateUser = await prisma.user.update({
      where: {
        id,
      },
      data: { photo },
    });
    return updateUser;
  } catch (err) {
    return { error: err };
  }
}

export async function userReturningAdoptedPet(id: string) {
  try {
    const updateUser = await prisma.user.update({
      where: {
        id,
      },
      data: { returned: new Date() },
    });
    return updateUser;
  } catch (err) {
    return { error: err };
  }
}
