import express from "express";
import { createBloodRequest } from "../controller/bloodRequestController.js";

const router = express.Router();

// POST request
router.post("/", createBloodRequest);

export default router;