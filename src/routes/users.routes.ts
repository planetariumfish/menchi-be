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
  getUserInfo,
  logout,
  userLogin,
  userSignup,
} from "../controllers/userControllers";
import { upload } from "../middleware/multer";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary";
import validate from "../middleware/validate";
import { loginSchema, signupSchema } from "../schemas/user.schema";
import { adminEditUser, sendAllUsers } from "../controllers/adminControllers";

const router = express.Router();

router.get("/", auth, getUserInfo);

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

// admin routes

router.get("/all", auth, isAdmin, sendAllUsers);

router.put("/:id", auth, isAdmin, adminEditUser);

export default router;
