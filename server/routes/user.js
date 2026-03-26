import express from "express";
import { getUserProfile, updateUserProfile } from "../controller/UserController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", verifyToken, getUserProfile);
router.put("/update", verifyToken, updateUserProfile);

export default router;