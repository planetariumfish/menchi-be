import { NextFunction, Request, Response } from "express";
import { getUserbyID } from "../models/users.prisma";
import bcryptjs from "bcryptjs";

// use after "auth" to get user ID from token
const oldPwdCheck = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body.user;
  const { oldpassword } = req.body;
  const user = await getUserbyID(id);
  if (user && "error" in user) throw new Error(user.error as string);
  if (user && (await bcryptjs.compare(oldpassword, user.password))) {
    delete req.body.oldpassword;
    delete req.body.repassword;
    next();
  } else res.status(400).send("Invalid credentials.");
};

export default oldPwdCheck;
