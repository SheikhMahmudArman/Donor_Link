import React, { useState } from "react";
import "../styles/Chat.css";

function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    function sendMessage() {
        if (message.trim() === "") return;

        setMessages([...messages, message]);
        setMessage("");
    }

    return (
        <div className="chat-container">
            <div className="chat-box">
                <h2>Live Chat</h2>

                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            {msg}
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Chat;