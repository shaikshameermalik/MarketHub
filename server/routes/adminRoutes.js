const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product"); 
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

// ✅ Middleware to Check Admin Role
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied. Admins only." });
    }
    next();
};

// 📌 1️⃣ Get All Users (Admin Only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash"); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 2️⃣ Get Single User by ID
router.get("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 3️⃣ Update User (Admin Only)
router.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { name, email, role, isVerified } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, isVerified },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 4️⃣ Delete User (Admin Only)
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 5️⃣ Approve Vendor Registration ✅
router.put("/users/:id/approve", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== "vendor") {
            return res.status(400).json({ message: "Vendor not found" });
        }

        user.isVerified = true; // Mark as approved
        user.status = "approved";
        await user.save();

        res.json({ message: "Vendor approved successfully", user });
    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 6️⃣ Reject Vendor Registration ❌
router.put("/users/:id/reject", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== "vendor") {
            return res.status(400).json({ message: "Vendor not found" });
        }

        user.isVerified = false; // Mark as rejected
        user.status = "rejected";
        await user.save();

        res.json({ message: "Vendor rejected successfully", user });
    } catch (error) {
        console.error("Error rejecting vendor:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 6️⃣ Create a New User (Admin Only)
router.post("/users", authMiddleware, adminMiddleware, async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            passwordHash: password,
            role,
            isVerified: role === "admin" ? true : false, // Only auto-verify admins
            status: role === "admin" ? "approved" : "pending" // Keep vendors pending
        });        

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Get all products (for admin)
router.get("/products",authMiddleware,adminMiddleware, async (req, res) => {
    try {
        const products = await Product.find().populate("vendor", "email"); // Populate vendor details
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products." });
    }
});

// ✅ Approve Product
router.put("/products/:productId/approve",authMiddleware, adminMiddleware,async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.approved = true; // Mark product as approved
        await product.save();
        res.json({ message: "Product approved successfully" });
    } catch (error) {
        console.error("Error approving product:", error);
        res.status(500).json({ message: "Failed to approve product." });
    }
});

// ❌ Reject Product
router.put("/products/:productId/reject",authMiddleware,adminMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.approved = false; // Mark product as rejected
        await product.save();
        res.json({ message: "Product rejected successfully" });
    } catch (error) {
        console.error("Error rejecting product:", error);
        res.status(500).json({ message: "Failed to reject product." });
    }
});

router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customerId", "name email")  // Correct field name
            .populate("products.productId", "name price"); // Correct field name
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders." });
    }
});

// 📌 Update Order Status (Admin Only)
router.put("/orders/:orderId/status", authMiddleware, adminMiddleware, async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.orderStatus = status;
        await order.save();

        res.json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Failed to update order status." });
    }
});

// 📌 Resolve Order Disputes (Admin Only)
router.put("/orders/:orderId/resolve", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { resolutionStatus } = req.body;
        const validStatuses = ["Refunded", "Disputed", "Cancelled"];

        if (!validStatuses.includes(resolutionStatus)) {
            return res.status(400).json({ message: "Invalid resolution status" });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.orderStatus = resolutionStatus;
        await order.save();

        res.json({ message: "Order resolution updated successfully", order });
    } catch (error) {
        console.error("Error resolving order:", error);
        res.status(500).json({ message: "Failed to resolve order." });
    }
});



module.exports = router;