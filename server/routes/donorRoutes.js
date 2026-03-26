import express from "express";
import {
  getEligibleDonors,
  getDonorStats,
  updateDonorStatus,
  getDonorById
} from "../controller/donorController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no auth required for viewing donors)
router.get("/", getEligibleDonors);
router.get("/stats", getDonorStats);
router.get("/:id", getDonorById);

// Protected routes
router.put("/status", verifyToken, updateDonorStatus);

export default router;