import express from "express";
import {
  getUser,
  login,
  logOut,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile/update").put(isAuthenticated, updateProfile);
router.route("/log-out").get(logOut);
router.route("/user-post").get(isAuthenticated, getUser);

export default router;
