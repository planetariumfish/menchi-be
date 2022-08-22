import { Request, Response } from "express";
import {
  addUser,
  getUserbyEmail,
  getUserbyID,
  updateUser,
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

    // return new user
    res.status(201).json({ token });
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
    res.status(200).json({ token });
  } else {
    res.status(400).send("Invalid credentials.");
  }
};

export const changePwd = async (req: Request, res: Response) => {
  const { id } = req.body.user;
  const data = Object.assign({ ...req.body });
  delete data.user;
  const user = await getUserbyID(id);
  if (user) {
    // encrypt password
    const encryptedPassword = await bcryptjs.hash(data.password, 12);
    data.password = encryptedPassword;
    const updatedUser = await updateUser(id, data);
  }
  res.status(200).send("Password updated!");
};

export const editUser = async (req: Request, res: Response) => {
  const { id } = req.body.user;
  const data = Object.assign({ ...req.body });
  delete data.user;
  const user = await getUserbyID(id);
  if (user) {
    const updatedUser = await updateUser(id, data);
  }
  res.status(200).send("Profile updated!");
};
