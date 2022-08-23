import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getUserbyID } from "../models/users.prisma";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body.user;

  const user = await getUserbyID(id);
  if (user?.role === Role.ADMIN) {
    next();
    return;
  }
  res.status(403).send({ ok: false, message: "Not an admin." });
};

export default isAdmin;
