import express from "express";
import { saveEligibility, getEligibility } from "../controller/eligibilityController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/status", verifyToken, getEligibility);
router.post("/save", verifyToken, saveEligibility);

export default router;