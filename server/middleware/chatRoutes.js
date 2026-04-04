// chatRoutes.js - Add authentication middleware

import express from "express";
import {
    sendInvite,
    getInvites,
    acceptInvite,
    declineInvite,
    getConversations,
    sendMessage,
    getMessages,
    confirmBlood
} from "../controller/chatController.js";
import { verifyToken } from "../middleware/auth.js";
import updateLastActive from "../middleware/updateLastActive.js";

const router = express.Router();

// All chat routes require authentication
router.post("/invite", verifyToken, updateLastActive, sendInvite);
router.get("/invites/:userId", verifyToken, updateLastActive, getInvites);
router.post("/invite/:id/accept", verifyToken, updateLastActive, acceptInvite);
router.post("/invite/:id/decline", verifyToken, updateLastActive, declineInvite);
router.get("/conversations/:userId", verifyToken, updateLastActive, getConversations);
router.post("/message", verifyToken, updateLastActive, sendMessage);
router.get("/messages/:id", verifyToken, updateLastActive, getMessages);
router.post("/conversation/:id/confirm-blood", verifyToken, updateLastActive, confirmBlood);

export default router;