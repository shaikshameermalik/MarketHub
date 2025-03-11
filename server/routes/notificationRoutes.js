const express = require("express");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Get User Notifications
router.get("/", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
});

// ✅ Mark Notification as Read
router.put("/:id/read", authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { readStatus: true }, { new: true });
        if (!notification) return res.status(404).json({ message: "Notification not found" });
        res.json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { userId, message, type } = req.body;

        if (!userId || !message || !type) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const notification = new Notification({
            userId,
            message,
            type,
            readStatus: false,
            createdAt: new Date()
        });

        await notification.save();
        res.status(201).json({ message: "Notification created successfully", notification });
    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ message: "Error creating notification", error });
    }
});

// Get unread notifications count for the logged-in user
router.get("/unread", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token middleware
        const unreadCount = await Notification.countDocuments({ userId, readStatus: false });

        res.json({ unreadCount });
    } catch (error) {
        console.error("Error fetching unread notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;