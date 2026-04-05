
import Invite from "../models/Invite.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js"; 

// SEND INVITE

export const sendInvite = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        console.log("=== Send Invite Debug ===");
        console.log("Request body:", req.body);
        
        if (!senderId || !receiverId) {
            return res.status(400).json({ error: "Missing senderId or receiverId" });
        }

        // Check if sender and receiver are same
        if (senderId === receiverId) {
            return res.status(400).json({ error: "Cannot invite yourself" });
        }

        // Check if users exist
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        
        if (!sender) {
            return res.status(404).json({ error: "Sender not found" });
        }
        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        // Check if there's already a pending invite
        const existing = await Invite.findOne({
            senderId,
            receiverId,
            status: "pending"
        });

        if (existing) {
            return res.status(400).json({ error: "Already invited" });
        }

        const invite = await Invite.create({ senderId, receiverId });

        res.json(invite);
    } catch (err) {
        console.error("Send Invite Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// GET INVITES

export const getInvites = async (req, res) => {
    try {
        const invites = await Invite.find({
            receiverId: req.params.userId,
            status: "pending"
        }).populate("senderId", "fullName");

        const shaped = invites.map(inv => ({
            id: inv._id,
            senderName: inv.senderId?.fullName || "Unknown"
        }));

        res.json(shaped);
    } catch (err) {
        console.error("Get Invites Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// ACCEPT INVITE

export const acceptInvite = async (req, res) => {
    try {
        const invite = await Invite.findById(req.params.id);
        if (!invite) return res.status(404).json({ error: "Invite not found" });

        invite.status = "accepted";
        await invite.save();

        // Avoid duplicate conversations
        const existingConv = await Conversation.findOne({
            participants: { $all: [invite.senderId, invite.receiverId] }
        });

        if (existingConv) return res.json(existingConv);

        const conversation = await Conversation.create({
            participants: [invite.senderId, invite.receiverId],
            lastMessage: "",
            lastMessageAt: new Date(),
            bloodConfirmedBy: []
        });

        res.json(conversation);
    } catch (err) {
        console.error("Accept Invite Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// DECLINE INVITE
export const declineInvite = async (req, res) => {
    try {
        const invite = await Invite.findById(req.params.id);
        if (!invite) return res.status(404).json({ error: "Invite not found" });

        invite.status = "declined";
        await invite.save();

        res.json({ message: "Invite declined" });
    } catch (err) {
        console.error("Decline Invite Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// GET CONVERSATIONS
export const getConversations = async (req, res) => {
    try {
        const userId = req.params.userId;

        const conversations = await Conversation.find({
            participants: userId
        }).populate("participants", "fullName");

        const shaped = conversations.map(conv => {
            const other = conv.participants.find(
                p => p._id.toString() !== userId
            );
            return {
                id: conv._id,
                participantId: other?._id,
                participantName: other?.fullName || "Unknown",
                lastMessage: conv.lastMessage,
                lastMessageAt: conv.lastMessageAt,
                bloodConfirmedBy: conv.bloodConfirmedBy
            };
        });

        res.json(shaped);
    } catch (err) {
        console.error("Get Conversations Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// SEND MESSAGE
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, senderId, content } = req.body;
        if (!conversationId || !senderId || !content) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const msg = await Message.create({ conversationId, senderId, content });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: content,
            lastMessageAt: new Date()
        });

        res.json({
            id: msg._id,
            conversationId: msg.conversationId,
            senderId: msg.senderId.toString(),
            content: msg.content,
            createdAt: msg.createdAt
        });
    } catch (err) {
        console.error("Send Message Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// GET MESSAGES
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.id
        }).sort({ createdAt: 1 });

        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const shapedMessages = messages.map(msg => ({
            id: msg._id,
            senderId: msg.senderId.toString(),
            content: msg.content,
            createdAt: msg.createdAt
        }));

        res.json({
            messages: shapedMessages,
            conversation: {
                id: conversation._id,
                bloodConfirmedBy: conversation.bloodConfirmedBy.map(id => id.toString())
            }
        });
    } catch (err) {
        console.error("Get Messages Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
// CONFIRM BLOOD

export const confirmBlood = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "Missing userId" });

        const conv = await Conversation.findById(req.params.id);
        if (!conv) return res.status(404).json({ error: "Conversation not found" });

        const alreadyConfirmed = conv.bloodConfirmedBy
            .map(id => id.toString())
            .includes(userId);

        if (!alreadyConfirmed) {
            conv.bloodConfirmedBy.push(userId);
            await conv.save();
        }

        res.json({
            bloodConfirmedBy: conv.bloodConfirmedBy.map(id => id.toString())
        });
    } catch (err) {
        console.error("Confirm Blood Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};