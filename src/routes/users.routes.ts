import express from "express";
import "dotenv/config";
import { getAllUsers, getUserbyID } from "../models/users.prisma";
import passwordsMatch from "../middleware/passwordsMatch";
import auth from "../middleware/auth";
import isAdmin from "../middleware/isAdmin";
import oldPwdCheck from "../middleware/oldPwdCheck";
import {
  changePwd,
  editUser,
  userLogin,
  userSignup,
} from "../controllers/userControllers";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { id } = req.body.user;
  const user = await getUserbyID(id);
  const safeUser = Object.assign({ ...user });
  delete safeUser.password;
  res.status(200).send(safeUser);
});

router.get("/all", auth, isAdmin, async (req, res) => {
  const users = await getAllUsers();
  res.send(users);
});

router.post("/register", passwordsMatch, userSignup);

router.post("/login", userLogin);

router.put("/edit", auth, editUser);

router.put("/changepwd", passwordsMatch, auth, oldPwdCheck, changePwd);

export default router;
