import { Router } from "express";
import {
    sendInvite,
    getPendingInvites,
    acceptInvite,
    declineInvite,
    getConversations,
    sendMessage,
    getMessages,
    toggleBloodConfirmed
} from "../controller/chatController.js";

const router = Router();

// Invite endpoints
router.post("/invite", sendInvite);                    // send invite
router.get("/invites/:userId", getPendingInvites);    // get pending invites
router.post("/invite/:inviteId/accept", acceptInvite);
router.post("/invite/:inviteId/decline", declineInvite);

// Conversation & messages
router.get("/conversations/:userId", getConversations);   // accepted chats
router.post("/message", sendMessage);
router.get("/messages/:conversationId", getMessages);

// Blood confirmation
router.post("/conversation/:conversationId/confirm-blood", toggleBloodConfirmed);

export default router;