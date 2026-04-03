import express from "express";
import { saveEligibility, getEligibility } from "../controller/eligibilityController.js";
import { verifyToken } from "../middleware/auth.js";
import updateLastActive from "../middleware/updateLastActive.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/status", verifyToken, updateLastActive, getEligibility);
router.post("/save", verifyToken, updateLastActive, saveEligibility);

export default router;