import { readBook, loginUser, registerUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyRole } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/books").get( readBook)

export default router;