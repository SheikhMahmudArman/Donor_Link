import React, { useState, useRef, useEffect } from "react";
import "../styles/Chat.css";

function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Scroll to bottom automatically
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function sendMessage() {
        if (message.trim() === "") return;

        // Alternate sender: true = user, false = "other"
        const sender = messages.length % 2 === 0;
        setMessages([...messages, { text: message, sender, time: new Date() }]);
        setMessage("");
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") sendMessage();
    }

    return (
        <div className="chat-container">
            <div className="chat-card">
                <div className="chat-header">
                    <h2>Live Chat</h2>
                    <p>Connect with donors in real-time</p>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`chat-message ${msg.sender ? "user" : "other"}`}
                        >
                            <span>{msg.text}</span>
                            <small>{msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Chat;