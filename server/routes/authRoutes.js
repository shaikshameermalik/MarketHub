const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { logAction } = require("./auditLogRoutes"); // ✅ Import audit logging
require("dotenv").config();
const nodemailer = require("nodemailer");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Setup Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 📌 Register User (Signup)
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role = "customer", profileDetails = {} } = req.body;

        // ✅ Validate role
        const allowedRoles = ["customer", "vendor", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role. Allowed roles: customer, vendor, admin" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already in use" });

        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

        user = new User({ name, email, passwordHash, role, profileDetails, isVerified: false });
        await user.save();

        // ✅ Log audit action
        await logAction(user._id, "User Signup", `New user registered: ${email} (Role: ${role})`);

        const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "MarketHub - Verify Your Email",
            html: `<p>Click the link below to verify your email and activate your account:</p>
                   <a href="${verificationLink}" target="_blank">${verificationLink}</a>
                   <p>This link will expire in 1 hour.</p>`
        });

        res.status(201).json({ message: "✅ User registered! Check your email for verification link." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 Verify Email
router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ message: "Invalid or missing token" });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.isVerified) return res.status(400).json({ message: "Email already verified!" });

        user.isVerified = true;
        await user.save();

        // ✅ Log audit action
        await logAction(user._id, "Email Verified", `User ${user.email} verified their email.`);

        return res.redirect("http://localhost:3000/email-verified");
    } catch (error) {
        console.error("Email Verification Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // ✅ Ensure email is verified before login
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email before logging in" });
        }

        // ✅ Compare passwords
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // ✅ Log audit action
        await logAction(user._id, "User Login", `User ${email} logged in.`);

        res.status(200).json({
            token,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileDetails: user.profileDetails
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        console.log("Authenticated user ID:", req.user.userId);

        const user = await User.findById(req.user.userId).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 Update User Profile
router.put("/profile", authMiddleware, async (req, res) => {
    const { name, profileDetails } = req.body;
    const userId = req.user.userId; // Get user ID from JWT token

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { name, profileDetails },
            { new: true }
        );

        // ✅ Log audit action
        await logAction(userId, "Profile Update", `User ${user.email} updated their profile.`);

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

module.exports = router;
