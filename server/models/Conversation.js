

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [mongoose.Schema.Types.ObjectId],
    lastMessage: String,
    lastMessageAt: Date,
    bloodConfirmedBy: [mongoose.Schema.Types.ObjectId]
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);
