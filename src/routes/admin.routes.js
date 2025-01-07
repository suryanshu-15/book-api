import { Router } from "express";
import { verifyRole } from "../middlewares/auth.middleware.js";
import { registerAdmin, loginAdmin, createBook, updateBook, readBook, deleteBook, logoutAdmin } from "../controllers/admin.controller.js";


const router = Router();


router.route("/register").post(registerAdmin)
router.route("/login").get(loginAdmin)
router.route("/books").get(readBook)

//secured routes
router.route("/books").post(verifyRole,createBook)
router.route("/books/:id").put(verifyRole, updateBook);
router.route("/books/:id").delete(verifyRole, deleteBook);
router.route("/logout").get(verifyRole, logoutAdmin)


export default router;