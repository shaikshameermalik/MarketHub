const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { createServer } = require("http");  // ✅ Import HTTP Server
const { Server } = require("socket.io");  // ✅ Import Socket.io

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes"); 
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { router: auditLogRoutes } = require("./routes/auditLogRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); 
const faqRoutes = require("./routes/faqRoutes");
// Import Routes
const vendorRoutes = require("./routes/vendorRoutes");

dotenv.config();

const app = express();
const server = createServer(app);  // ✅ Create HTTP server
const io = new Server(server, {    // ✅ Initialize Socket.io
    cors: {
        origin: "http://localhost:3000", // ✅ Allow frontend origin
        methods: ["GET", "POST"]
    }
});

// ✅ CORS Configuration
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/vendors", vendorRoutes);

// ✅ MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

    const chatMessages = []; // Store messages (Replace with MongoDB later)

    io.on("connection", (socket) => {
        console.log(`⚡ New user connected: ${socket.id}`);
    
        // Send previous chat messages when a user connects
        socket.emit("chatHistory", chatMessages);
    
        // Listen for new chat messages
        socket.on("sendMessage", (message) => {
            chatMessages.push(message); // Save message (Use DB later)
            io.emit("receiveMessage", message); // Broadcast to all users
    
            // **Bot Response Logic**
            setTimeout(() => {
                const botResponse = generateBotResponse(message.text);
                const botMessage = { sender: "bot", text: botResponse };
                chatMessages.push(botMessage); // Save bot response
                io.emit("receiveMessage", botMessage); // Send bot response to client
            }, 1000); // Simulate delay before responding
        });
    
        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log(`⚡ User disconnected: ${socket.id}`);
        });
    });
    
    // **Simple Bot Response Logic**
    function generateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
    
        if (lowerMessage.includes("hello")) {
            return "Hello! How can I assist you today?";
        } else if (lowerMessage.includes("order")) {
            return "You can track your order in the Orders section.";
        } else if (lowerMessage.includes("refund")) {
            return "For refunds, please visit the support section.";
        } else if (lowerMessage.includes("help")) {
            return "I'm here to help! Please describe your issue.";
        } else {
            return "I'm not sure I understand. Can you clarify?";
        }
    }
    

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

console.log("Auth Routes Loaded:", authRoutes);
console.log("Product Routes Loaded:", productRoutes);


