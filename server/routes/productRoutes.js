const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import authentication middleware

const router = express.Router();

// ✅ Get All Products (Public Access)


// ✅ Get Products for Logged-in Vendor
router.get("/", authMiddleware, async (req, res) => {
    try {
        let products;
        
        // If vendor, fetch only their products
        if (req.user.role === "vendor") {
            products = await Product.find({ vendorId: req.user.userId });
        } else {
            // Customers/Admins see all approved products
            products = await Product.find({});
        }

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Fetching product with ID: ${id}`);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("❌ Invalid MongoDB ObjectId");
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id);
        if (!product) {
            console.log("❌ Product not found");
            return res.status(404).json({ message: "Product not found" });
        }

        console.log("✅ Product found:", product);
        res.json(product);
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        res.status(500).json({ message: "Server error" });
    }
});





// ✅ Create a Product (Only for Vendors)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, price, image, description, category, stock } = req.body;

        if (req.user.role !== "vendor") {
            return res.status(403).json({ message: "Access denied. Only vendors can add products." });
        }

        console.log("🔹 Vendor Object ID:", req.user._id); // Debugging
        console.log("🔹 Vendor User ID:", req.user.userId); // Debugging

        const newProduct = new Product({
            name,
            price,
            image,
            description,
            category,
            stock,
            vendorId: req.user.userId, // 🔹 Store userId instead of _id
        });

        await newProduct.save();
        res.status(201).json({ message: "✅ Product added successfully!", product: newProduct });
    } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ Update a Product (Only Vendor Who Added It)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.user.role !== "vendor" || product.vendorId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. You can only update your own products." });
        }

        Object.assign(product, req.body);
        await product.save();
        res.json({ message: "✅ Product updated successfully!", product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Delete a Product (Only Vendor Who Added It)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.user.role !== "vendor" || product.vendorId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Access denied. You can only delete your own products." });
        }

        await product.deleteOne();
        res.json({ message: "✅ Product deleted successfully!" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
