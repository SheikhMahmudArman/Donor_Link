import React, { useState, useEffect } from "react";
import '../styles/Chat.css';

// Dummy helper to get logged-in user ID from localStorage or your auth system
function getUserId() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
}

function Chat() {
    const currentUserId = getUserId();
    const [pendingInvites, setPendingInvites] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [bloodConfirmed, setBloodConfirmed] = useState(false);
    const [confirmedByCount, setConfirmedByCount] = useState(0);

    useEffect(() => {
        if (!currentUserId) return;

        // Fetch pending invites
        fetch(`/api/chat/invites/${currentUserId}`)
            .then(res => res.json())
            .then(data => setPendingInvites(data))
            .catch(console.error);

        // Fetch accepted conversations
        fetch(`/api/chat/conversations/${currentUserId}`)
            .then(res => res.json())
            .then(data => setConversations(data))
            .catch(console.error);
    }, [currentUserId]);

    // Fetch messages when selectedConv changes
    useEffect(() => {
        if (!selectedConv) return;

        fetch(`/api/chat/messages/${selectedConv.id}`)
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages);
                setBloodConfirmed(data.conversation.bloodConfirmedBy.includes(currentUserId));
                setConfirmedByCount(data.conversation.bloodConfirmedBy.length);
            })
            .catch(console.error);
    }, [selectedConv, currentUserId]);

    function acceptInvite(inviteId) {
        fetch(`/api/chat/invite/${inviteId}/accept`, { method: "POST" })
            .then(() => {
                setPendingInvites(pendingInvites.filter(inv => inv.id !== inviteId));
                return fetch(`/api/chat/conversations/${currentUserId}`);
            })
            .then(res => res.json())
            .then(data => setConversations(data))
            .catch(console.error);
    }

    function declineInvite(inviteId) {
        fetch(`/api/chat/invite/${inviteId}/decline`, { method: "POST" })
            .then(() => setPendingInvites(pendingInvites.filter(inv => inv.id !== inviteId)))
            .catch(console.error);
    }

    function handleSendMessage(e) {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        fetch(`/api/chat/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                conversationId: selectedConv.id,
                senderId: currentUserId,
                content: newMessage
            })
        })
            .then(res => res.json())
            .then(msg => {
                setMessages([...messages, msg]);
                setNewMessage("");
            })
            .catch(console.error);
    }

    function toggleBloodConfirmed() {
        if (!selectedConv) return;

        fetch(`/api/chat/conversation/${selectedConv.id}/confirm-blood`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserId })
        })
            .then(res => res.json())
            .then(data => {
                setBloodConfirmed(data.bloodConfirmedBy.includes(currentUserId));
                setConfirmedByCount(data.bloodConfirmedBy.length);
            })
            .catch(console.error);
    }

    return (
        <div className="chat-container">
            {/* Left sidebar: Pending Invites */}
            <div className="sidebar invites">
                <h3>Pending Invites</h3>
                {pendingInvites.length === 0 && <p>No pending invites</p>}
                {pendingInvites.map(inv => (
                    <div key={inv.id} className="invite-item">
                        <span>{inv.senderName}</span>
                        <div className="invite-buttons">
                            <button onClick={() => acceptInvite(inv.id)}>Accept</button>
                            <button onClick={() => declineInvite(inv.id)}>Decline</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle sidebar: Accepted Conversations */}
            <div className="sidebar conversations">
                <h3>Chats</h3>
                {conversations.length === 0 && <p>No chats yet</p>}
                {conversations
                    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)) // LIFO
                    .map(conv => (
                        <div
                            key={conv.id}
                            className={`conversation-item ${selectedConv?.id === conv.id ? "selected" : ""}`}
                            onClick={() => setSelectedConv(conv)}
                        >
                            <div className="conv-name">{conv.participantName}</div>
                            <div className="last-message">{conv.lastMessage}</div>
                        </div>
                    ))}
            </div>

            {/* Right: Chat window */}
            <div className="chat-window">
                {selectedConv ? (
                    <>
                        <div className="messages">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`message ${msg.senderId === currentUserId ? "sent" : "received"}`}
                                >
                                    <div className="message-content">{msg.content}</div>
                                </div>
                            ))}
                        </div>

                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <button type="submit">Send</button>
                        </form>

                        <div className="blood-confirm">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={bloodConfirmed}
                                    onChange={toggleBloodConfirmed}
                                />
                                Blood Received
                            </label>
                            <span>{confirmedByCount} confirmed</span>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;