import React, { useState, useEffect, useRef } from "react";
import '../styles/Chat.css';
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/chat";

function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    } catch (e) {
        console.error("Error parsing user:", e);
        return null;
    }
}

function getUserId() {
    const user = getCurrentUser();
    return user?._id || null;
}

function Chat() {
    const currentUserId = getUserId();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [receivedInvites, setReceivedInvites] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [bloodConfirmed, setBloodConfirmed] = useState(false);
    const [otherUserConfirmed, setOtherUserConfirmed] = useState(false);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("=== Chat Debug ===");
        console.log("Current User ID:", currentUserId);
        console.log("Token exists?", !!localStorage.getItem('token'));

        if (!currentUserId) {
            console.log("No user ID found");
            setLoading(false);
            return;
        }

        Promise.all([
            fetch(`${API}/invites/${currentUserId}`).then(res => res.json()),
            fetch(`${API}/conversations/${currentUserId}`).then(res => res.json())
        ])
            .then(([invitesData, conversationsData]) => {
                console.log("Invites:", invitesData);
                console.log("Conversations:", conversationsData);
                setReceivedInvites(invitesData || []);
                setConversations(conversationsData || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [currentUserId]);

    useEffect(() => {
        if (!selectedConv) return;
        fetch(`${API}/messages/${selectedConv.id}`)
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages || []);
                const currentConfirmed = data.conversation?.bloodConfirmedBy?.includes(currentUserId) || false;
                setBloodConfirmed(currentConfirmed);
                const otherUser = conversations.find(c => c.id === selectedConv.id)?.participantId;
                const otherConfirmed = data.conversation?.bloodConfirmedBy?.includes(otherUser) || false;
                setOtherUserConfirmed(otherConfirmed);
            })
            .catch(console.error);
    }, [selectedConv, currentUserId, conversations]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function acceptInvite(inviteId) {
        fetch(`${API}/invite/${inviteId}/accept`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }  // FIXED: quotes added
        })
            .then(res => res.json())
            .then(() => {
                fetch(`${API}/invites/${currentUserId}`)
                    .then(res => res.json())
                    .then(setReceivedInvites);
                fetch(`${API}/conversations/${currentUserId}`)
                    .then(res => res.json())
                    .then(setConversations);
            })
            .catch(console.error);
    }

    function declineInvite(inviteId) {
        fetch(`${API}/invite/${inviteId}/decline`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then(() => {
                setReceivedInvites(prev => prev.filter(inv => inv.id !== inviteId));
            })
            .catch(console.error);
    }

    function sendMessageHandler(e) {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv || sending) return;

        setSending(true);
        fetch(`${API}/message`, {
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
                setMessages(prev => [...prev, msg]);
                setNewMessage("");
                setConversations(prev => prev.map(conv =>
                    conv.id === selectedConv.id
                        ? { ...conv, lastMessage: newMessage, lastMessageAt: new Date() }
                        : conv
                ));
            })
            .catch(console.error)
            .finally(() => setSending(false));
    }

    function handleBloodConfirm() {
        if (!selectedConv) return;
        fetch(`${API}/conversation/${selectedConv.id}/confirm-blood`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserId })
        })
            .then(res => res.json())
            .then(data => {
                setBloodConfirmed(true);
                setOtherUserConfirmed(data.bloodConfirmedBy.includes(
                    conversations.find(c => c.id === selectedConv.id)?.participantId
                ));
            })
            .catch(console.error);
    }

    function deleteMessage(messageId) {
        if (window.confirm("Delete this message?")) {
            setMessages(prev => prev.filter(m => m.id !== messageId));
        }
    }

    function formatTime(date) {
        if (!date) return "";
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return "Just now";
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString();
    }

    if (loading) {
        return (
            <div className="chat-shell">
                <div className="no-chat">
                    <p>Loading chat...</p>
                </div>
            </div>
        );
    }

    if (!currentUserId) {
        return (
            <div className="chat-shell">
                <div className="no-chat">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                    <p>Please login to access chat</p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            marginTop: '16px',
                            padding: '8px 24px',
                            background: '#1D9E75',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-shell">
            <div className="invite-panel">
                <div className="panel-header">Chat Requests</div>
                <div className="invite-list">
                    {receivedInvites.length === 0 ? (
                        <div className="empty-note">No pending requests</div>
                    ) : (
                        receivedInvites.map(invite => (
                            <div key={invite.id} className="invite-item">
                                <div className="avatar sm">
                                    {invite.senderName?.charAt(0) || "?"}
                                </div>
                                <div className="invite-info">
                                    <div className="invite-name">{invite.senderName}</div>
                                    <div className="invite-actions">
                                        <button className="btn-accept" onClick={() => acceptInvite(invite.id)}>
                                            Accept
                                        </button>
                                        <button className="btn-decline" onClick={() => declineInvite(invite.id)}>
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="panel-divider">Active Chats</div>
                <div className="invite-list">
                    {conversations.length === 0 ? (
                        <div className="empty-note">No conversations yet<br /><small>Click "Contact" on a donor</small></div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.id}
                                className="invite-item"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSelectedConv(conv)}
                            >
                                <div className="avatar sm">
                                    {conv.participantName?.charAt(0) || "?"}
                                </div>
                                <div className="invite-info">
                                    <div className="invite-name">{conv.participantName}</div>
                                    <div className="invite-meta">
                                        {conv.lastMessage?.slice(0, 30) || "No messages yet"}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="conv-panel">
                <div className="conv-panel-header">Messages</div>
                {conversations.length === 0 ? (
                    <div className="empty-note" style={{ textAlign: 'center', padding: '40px' }}>
                        No conversations yet
                    </div>
                ) : (
                    conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={`conv-item ${selectedConv?.id === conv.id ? 'active' : ''}`}
                            onClick={() => setSelectedConv(conv)}
                        >
                            <div className="avatar sm">
                                {conv.participantName?.charAt(0) || "?"}
                            </div>
                            <div className="conv-text">
                                <div className="conv-top">
                                    <div className="conv-name">{conv.participantName}</div>
                                    <div className="conv-time">{formatTime(conv.lastMessageAt)}</div>
                                </div>
                                <div className="conv-last">{conv.lastMessage || "Start a conversation"}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedConv ? (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="avatar">
                            {selectedConv.participantName?.charAt(0) || "?"}
                        </div>
                        <div>
                            <div className="chat-title">{selectedConv.participantName}</div>
                            <div className="chat-subtitle">
                                {bloodConfirmed && otherUserConfirmed
                                    ? "✓ Blood donation completed ✓"
                                    : bloodConfirmed
                                        ? "You confirmed ✓ Waiting for other"
                                        : "Confirm blood donation"}
                            </div>
                        </div>
                    </div>

                    <div className="messages-area">
                        {messages.length === 0 ? (
                            <div className="no-chat">No messages yet. Start the conversation!</div>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className={`msg-wrap ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
                                    <div className="msg-bubble">
                                        {msg.content}
                                        {msg.senderId === currentUserId && (
                                            <button
                                                onClick={() => deleteMessage(msg.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    marginLeft: '8px',
                                                    cursor: 'pointer',
                                                    opacity: 0.5,
                                                    color: msg.senderId === currentUserId ? 'white' : 'black'
                                                }}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                    <div className="msg-time">{formatTime(msg.createdAt)}</div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="blood-bar">
                        <label className="blood-label">
                            <input
                                type="checkbox"
                                className="blood-checkbox"
                                checked={bloodConfirmed}
                                onChange={handleBloodConfirm}
                                disabled={bloodConfirmed}
                            />
                            <div className="blood-check-box">
                                {bloodConfirmed && <span>✓</span>}
                            </div>
                            <span>Confirm blood donation completed</span>
                        </label>
                        {otherUserConfirmed && (
                            <div className="confirm-count">✓ Other confirmed ✓</div>
                        )}
                    </div>

                    <form className="input-bar" onSubmit={sendMessageHandler}>
                        <input
                            type="text"
                            className="msg-input"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="send-btn" disabled={!newMessage.trim() || sending}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </form>
                </div>
            ) : (
                <div className="chat-window">
                    <div className="no-chat">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <p>Select a conversation to start chatting</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;