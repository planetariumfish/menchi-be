import { Request, Response } from "express";
import {
  addUser,
  getUserbyEmail,
  getUserbyID,
  updateUser,
  updateUserPhoto,
} from "../models/users.prisma";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // find if user already exists
    const oldUser = await getUserbyEmail(email);
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login!");
    }

    // encrypt password
    const encryptedPassword = await bcryptjs.hash(password, 12);

    const user = await addUser({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: "2h",
      }
    );

    // set cookie
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 3,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).send({ ok: true, id: user.id });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong.", err });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserbyEmail(email);
  if (user && (await bcryptjs.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: "2h",
      }
    );
    // set cookie
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 3,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ ok: true, id: user.id });
  } else {
    res.status(400).send("Invalid credentials.");
  }
};

export const changePwd = async (req: Request, res: Response) => {
  const { id } = req.body.user;
  const data = Object.assign({ ...req.body });
  delete data.user;
  const user = await getUserbyID(id);
  if (!user) {
    res.status(404).send({ ok: false, message: "User not found" });
    return;
  }
  try {
    // encrypt password
    const encryptedPassword = await bcryptjs.hash(data.password, 12);
    data.password = encryptedPassword;
    await updateUser(id, data);
    res.status(200).send({ ok: true, message: "Password updated!" });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const editUser = async (req: Request, res: Response) => {
  const { id } = req.body.user;
  const data = Object.assign({ ...req.body });
  delete data.user;
  const user = await getUserbyID(id);
  if (!user) {
    res.status(404).send({ ok: false, message: "User not found" });
    return;
  }
  try {
    await updateUser(id, data);
    res.status(200).send({ ok: true, message: "Profile updated!" });
  } catch (err) {
    res.status(500).send(err);
  }
};

// could probably be folded into editUser
export const addPhoto = async (req: Request, res: Response) => {
  const { id } = req.body;
  const { photo } = req.body;
  const user = await getUserbyID(id);
  if (!user) {
    res.status(404).send({ ok: false, message: "User not found" });
    return;
  }
  try {
    await updateUserPhoto(id, photo);
    res.status(200).send({ ok: true, message: "Photo uploaded!" });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  const { id } = req.body.user;
  const user = await getUserbyID(id);
  const safeUser = Object.assign({ ...user });
  delete safeUser.password;
  res.status(200).send(safeUser);
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).send({ ok: true, message: "Goodbye!" });
};
