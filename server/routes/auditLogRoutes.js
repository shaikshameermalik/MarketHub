const express = require("express");
const AuditLog = require("../models/AuditLog");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Get All Audit Logs (Admin Only)
router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const logs = await AuditLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching audit logs", error });
    }
});

// ✅ Log an Action (Use in other APIs)
const logAction = async (userId, action, details) => {
    try {
        await AuditLog.create({ userId, action, details });
    } catch (error) {
        console.error("Error logging action:", error);
    }
};

module.exports = { router, logAction };
