import { PrismaClient, User } from "@prisma/client";
import { NewUser } from "../types/types";

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
