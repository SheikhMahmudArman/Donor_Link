import { Router } from "express";
const router = Router();
import { loginUser } from "../controller/loginController.js";

router.post("/login", loginUser);

export default router;