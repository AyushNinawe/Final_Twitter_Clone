import express from "express";
import { Register, } from "../controllers/userController.js";
import { Login } from "../controllers/userController.js";
import { logout } from "../controllers/userController.js";
import { getMyProfile } from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";
import { follow } from "../controllers/userController.js";
import { unfollow } from "../controllers/userController.js";
import { getOtherUsers } from "../controllers/userController.js";
import { bookmark } from "../controllers/userController.js";
const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/profile/:id").get(isAuthenticated,getMyProfile);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);
router.route("/bookmark/:id").put(isAuthenticated, bookmark);









export default router;