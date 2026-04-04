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

const router = express.Router();

router.post("/invite", sendInvite);
router.get("/invites/:userId", getInvites);
router.post("/invite/:id/accept", acceptInvite);
router.post("/invite/:id/decline", declineInvite);
router.get("/conversations/:userId", getConversations);
router.post("/message", sendMessage);
router.get("/messages/:id", getMessages);
router.post("/conversation/:id/confirm-blood", confirmBlood);

export default router;