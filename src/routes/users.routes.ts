import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {
  getAllUsers,
  addUser,
  getUserbyEmail,
  getUserbyID,
} from "../models/users.prisma";
import passwordsMatch from "../middleware/passwordsMatch";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await getAllUsers();
  res.send(users);
});

router.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const user = await getUserbyID(id);
  res.status(200).send(user);
});

router.post("/register", passwordsMatch, async (req, res) => {
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
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong.", err });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserbyEmail(email.toLowerCase());
  if (user && (await bcryptjs.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: "2h",
      }
    );
    res.status(200).json({ user, token });
  } else {
    res.status(400).send("Invalid credentials.");
  }
});

export default router;
