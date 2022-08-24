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
  logout,
  userLogin,
  userSignup,
} from "../controllers/userControllers";
import { upload } from "../middleware/multer";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary";
import validate from "../middleware/validate";
import { loginSchema, signupSchema } from "../schemas/user.schema";
import { SafeUser } from "../types/types";

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
  const safeUsers: SafeUser[] = [];
  users.forEach((user) => {
    const safeUser = Object.assign({ ...user });
    delete safeUser.password;
    safeUsers.push(safeUser);
  });
  res.status(200).send(safeUsers);
});

router.post("/register", validate(signupSchema), passwordsMatch, userSignup);

router.post("/login", validate(loginSchema), userLogin);

router.put("/edit", auth, editUser);

router.put("/changepwd", passwordsMatch, auth, oldPwdCheck, changePwd);

router.post(
  "/upload",
  auth,
  upload.single("avatar"),
  uploadToCloudinary,
  addPhoto
);

router.get("/logout", logout);

export default router;
