import { Request, Response } from "express";
import { getUserbyID, updateUser, getAllUsers } from "../models/users.prisma";
import { SafeUser } from "../types/types";

export const adminEditUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = Object.assign({ ...req.body });
  delete data.user;
  console.log(data);
  const user = await getUserbyID(id);
  if (!user) {
    res.status(404).send({ ok: false, message: "User not found" });
    return;
  }
  try {
    await updateUser(id, data);
    res
      .status(200)
      .send({ ok: true, message: `User info updated for user ${id}` });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const sendAllUsers = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  const safeUsers: SafeUser[] = [];
  users.forEach((user) => {
    const safeUser = Object.assign({ ...user });
    delete safeUser.password;
    safeUsers.push(safeUser);
  });
  res.status(200).send(safeUsers);
};
