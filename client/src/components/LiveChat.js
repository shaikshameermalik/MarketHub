import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const socket = io("http://localhost:5000");

const LiveChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.on("chatHistory", (history) => {
            setMessages(history);
        });

        socket.on("receiveMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off("chatHistory");
            socket.off("receiveMessage");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = { text: message, sender: "Customer" };
            socket.emit("sendMessage", newMessage);
            setMessage("");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg border-0 rounded">
                <div className="card-header bg-primary text-white text-center">
                    <h5 className="mb-0">💬 Live Chat Support</h5>
                </div>
                <div className="card-body chat-box overflow-auto" style={{ height: "300px" }}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`d-flex mb-2 ${msg.sender === "Customer" ? "justify-content-end" : "justify-content-start"}`}>
                            <div className={`p-2 rounded ${msg.sender === "Customer" ? "bg-success text-white" : "bg-light text-dark"}`} 
                                 style={{ maxWidth: "75%" }}>
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card-footer">
                    <div className="input-group">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="form-control"
                        />
                        <button className="btn btn-primary" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveChat;
