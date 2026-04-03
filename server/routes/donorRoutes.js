import express from "express";
import {
  getEligibleDonors,
  getDonorStats,
  updateDonorStatus,
  getDonorById
} from "../controller/donorController.js";
import { verifyToken } from "../middleware/auth.js";
import updateLastActive from "../middleware/updateLastActive.js";

const router = express.Router();

// Public routes (no auth required for viewing donors)
router.get("/", verifyToken, updateLastActive, getEligibleDonors);
router.get("/stats", getDonorStats);
router.get("/:id", getDonorById);

// Protected routes
router.put("/status", verifyToken, updateLastActive, updateDonorStatus);

export default router;