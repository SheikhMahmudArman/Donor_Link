import express from "express";
import bloodRequestController from "../controller/bloodRequestController.js";
import { verifyToken } from "../middleware/auth.js";
import updateLastActive from "../middleware/updateLastActive.js";

const router = express.Router();

// Protected routes
router.post("/", verifyToken, updateLastActive, bloodRequestController.createBloodRequest);
router.post("/send-request", verifyToken, updateLastActive, bloodRequestController.sendRequestToDonor);
router.get("/pending", verifyToken, updateLastActive, bloodRequestController.getPendingRequestsForDonor);
router.post("/accept", verifyToken, updateLastActive, bloodRequestController.acceptBloodRequest);
router.get("/pending/count", verifyToken, updateLastActive, bloodRequestController.getPendingRequestCount);

export default router;