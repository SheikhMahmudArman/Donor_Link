import express from "express";
import { getUserProfile, updateUserProfile } from "../controller/UserController.js";
import { verifyToken } from "../middleware/auth.js";
import updateLastActive from "../middleware/updateLastActive.js";

const router = express.Router();

router.get("/me", verifyToken, updateLastActive, getUserProfile);
router.put("/update", verifyToken, updateLastActive, updateUserProfile);

export default router;