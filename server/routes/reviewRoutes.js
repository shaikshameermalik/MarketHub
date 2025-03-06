const express = require("express");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Add a Review
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const customerId = req.user.userId; // ✅ Ensure `id` exists in `req.user`

        if (!customerId) {
            console.warn("🚨 Customer ID is missing in req.user!");
            return res.status(401).json({ message: "User authentication failed" });
        }

        if (!productId || !rating) {
            return res.status(400).json({ message: "Product ID and rating are required" });
        }

        const newReview = new Review({ productId, customerId, rating, comment });
        await newReview.save();

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error("❌ Error adding review:", error);
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
});

// ✅ Get Reviews for a Product
router.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const reviews = await Review.find({ productId }).populate("customerId", "name"); // ✅ Ensure User schema has "name"

        res.status(200).json(reviews);
    } catch (error) {
        console.error("❌ Error fetching reviews:", error);
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
});

// ✅ Delete a Review (Only by the user who wrote it)
router.delete("/:reviewId", authMiddleware, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.customerId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this review" });
        }

        await review.deleteOne();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting review:", error);
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
});

module.exports = router;
