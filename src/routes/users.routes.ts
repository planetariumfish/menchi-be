import express from "express";
import "dotenv/config";
import { getAllUsers, getUserbyID } from "../models/users.prisma";
import passwordsMatch from "../middleware/passwordsMatch";
import auth from "../middleware/auth";
import isAdmin from "../middleware/isAdmin";
import oldPwdCheck from "../middleware/oldPwdCheck";
import {
  addPhoto,
  changePwd,
  editUser,
  userLogin,
  userSignup,
} from "../controllers/userControllers";
import { upload } from "../middleware/multer";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary";

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
  const safeUsers: string[] = [];
  users.forEach((user) => safeUsers.push(user.id));
  res.status(200).send(safeUsers);
});

router.post("/register", passwordsMatch, userSignup);

router.post("/login", userLogin);

router.put("/edit", auth, editUser);

router.put("/changepwd", passwordsMatch, auth, oldPwdCheck, changePwd);

router.post(
  "/upload",
  auth,
  upload.single("avatar"),
  uploadToCloudinary,
  addPhoto
);

export default router;
