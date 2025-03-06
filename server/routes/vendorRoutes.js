const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/Order");

router.get("/sales-report/:vendorId", async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Convert vendorId to ObjectId (if stored as ObjectId in MongoDB)
        const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

        const orders = await Order.aggregate([
            { $match: { vendorId: { $in: [vendorObjectId] } } }, // Match vendor ID inside array
            { $unwind: "$products" }, // Unwind products array
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalSales: { $sum: "$products.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$productDetails.price", "$products.quantity"] } },
                },
            },
            { $sort: { "_id.month": 1 } },
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const salesByMonth = {};
        let totalSales = 0;
        let totalRevenue = 0;

        orders.forEach(order => {
            const monthName = monthNames[order._id.month - 1];
            salesByMonth[monthName] = order.totalSales;
            totalSales += order.totalSales;
            totalRevenue += order.totalRevenue;
        });

        res.json({ totalSales, totalRevenue, salesByMonth });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
