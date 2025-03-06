const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const FAQ = require("../models/FAQ");

const router = express.Router();

// 📌 Get All FAQs (Accessible to all customers)
router.get("/", async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ message: "Failed to fetch FAQs." });
    }
});

// 📌 Create a New FAQ (Admin Only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) {
        return res.status(400).json({ message: "Both question and answer are required." });
    }

    try {
        const newFAQ = new FAQ({ question, answer });
        await newFAQ.save();
        res.status(201).json({ message: "FAQ added successfully", faq: newFAQ });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ message: "Failed to create FAQ." });
    }
});

// 📌 Update an FAQ (Admin Only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { question, answer } = req.body;

    try {
        const faq = await FAQ.findByIdAndUpdate(
            req.params.id,
            { question, answer },
            { new: true }
        );

        if (!faq) return res.status(404).json({ message: "FAQ not found" });

        res.json({ message: "FAQ updated successfully", faq });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({ message: "Failed to update FAQ." });
    }
});

// 📌 Delete an FAQ (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) return res.status(404).json({ message: "FAQ not found" });

        res.json({ message: "FAQ deleted successfully" });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).json({ message: "Failed to delete FAQ." });
    }
});

module.exports = router;
