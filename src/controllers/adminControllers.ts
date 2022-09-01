import { NextFunction, Request, Response } from "express";
import { getUserbyID, updateUser, getAllUsers } from "../models/users.prisma";
import { SafeUser } from "../types/types";
import { User } from "@prisma/client";

export const adminEditUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const data = Object.assign({ ...req.body });
  delete data.user;
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
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const adminGetUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const data = Object.assign({ ...req.body });
  delete data.user;
  try {
    const user = await getUserbyID(id);
    if (!user) {
      res.status(404).send({ ok: false, message: "User not found" });
      return;
    }
    const safeUser = Object.assign({ ...user });
    delete safeUser.password;
    res.status(200).send({ ok: true, user: safeUser });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const sendAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    if ("error" in users) throw new Error(users.error as string);
    const safeUsers: SafeUser[] = [];
    users.forEach((user) => {
      const safeUser = Object.assign({ ...user });
      delete safeUser.password;
      safeUsers.push(safeUser);
    });
    res.status(200).send({ ok: true, users: safeUsers });
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};
