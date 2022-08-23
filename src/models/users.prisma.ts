import { PrismaClient, User } from "@prisma/client";
import { NewUser } from "../types/types";

// tRPC docs - utils folder - prisma file (to see how to generate one instance of the client)
const prisma = new PrismaClient();

export async function getAllUsers() {
  const allUsers = await prisma.user.findMany();
  return allUsers;
}

export async function addUser(user: NewUser) {
  const newUser = await prisma.user.create({ data: user });
  return newUser;
}

export async function getUserbyEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  return user;
}

export async function getUserbyID(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
}

export async function updateUser(id: string, data: User) {
  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data,
  });
  return updateUser;
}

export async function updateUserPhoto(id: string, photo: string) {
  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: { photo },
  });
  return updateUser;
}
