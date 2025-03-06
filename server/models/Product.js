const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "https://via.placeholder.com/150" },
    description: { type: String },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Link to vendor
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
