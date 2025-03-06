const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification"); // ✅ Import Notification model


const router = express.Router();

// 📌 Place an Order
router.post("/", authMiddleware, async (req, res) => {
    try {
        const customerId = req.user.userId; // Get logged-in customer ID
        const { products, shippingAddress } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item" });
        }

        let totalAmount = 0;
        let vendorIds = new Set(); // To store unique vendor IDs

        // Fetch product details to calculate total price and get vendor IDs
        const productDetails = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Product with ID ${item.productId} not found`);

                vendorIds.add(product.vendorId); // Store vendor ID
                totalAmount += product.price * item.quantity; // Calculate total price

                return {
                    productId: product._id,
                    quantity: item.quantity
                };
            })
        );

        // Create new order
        const newOrder = new Order({
            customerId,
            vendorId: Array.from(vendorIds), // Convert Set to Array
            products: productDetails,
            totalAmount,
            shippingAddress,
            orderStatus: "Pending",
        });

        await newOrder.save();

        // ✅ Send notifications to all vendors involved in the order
        const notificationPromises = Array.from(vendorIds).map(async (vendorId) => {
            const newNotification = new Notification({
                userId: vendorId,
                message: `New Order Received! Order ID: ${newOrder._id}`,
                type: "order",
                isRead: false,
            });
            return newNotification.save();
        });

        await Promise.all(notificationPromises);

        res.status(201).json({ message: "✅ Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Order Placement Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// 📌 Get All Orders for Logged-in Customer
// 📌 Get Orders for Customers or Vendors
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;

        let orders;
        if (userRole === "customer") {
            // Customers: Get orders they placed
            orders = await Order.find({ customerId: userId }).populate("products.productId");
        } else if (userRole === "vendor") {
            // Vendors: Get orders that contain their products
            orders = await Order.find({ vendorId: userId }).populate("products.productId");
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.json(orders);
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// 📌 Get Order by ID
router.get("/:orderId", authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (error) {
        console.error("Get Order Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// 📌 Get All Orders (Admin Only)
router.get("/all", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const orders = await Order.find().populate("products.productId customerId vendorId");
        res.json(orders);
    } catch (error) {
        console.error("Admin Get Orders Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 Update Order Status (Vendor & Admin Only)
router.put("/:orderId/status", authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;
        const userId = req.user.userId;
        const userRole = req.user.role;

        if (!["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // ✅ Vendor can only update orders that contain their products
        if (userRole === "vendor") {
            const isVendorOrder = order.vendorId.some((vendor) => vendor.toString() === userId);
            if (!isVendorOrder) {
                return res.status(403).json({ message: "You can only update your own orders" });
            }
        }

        // ✅ Admin can update any order
        if (userRole !== "vendor" && userRole !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // 🔹 Update Order Status
        order.orderStatus = orderStatus;
        await order.save();

        res.json({ message: `✅ Order status updated to ${orderStatus}`, order });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// 📌 Cancel Order (Customer Only)
router.delete("/:orderId/cancel", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId } = req.params;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // ✅ Check if the order belongs to the customer
        if (order.customerId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized: You can only cancel your own orders" });
        }

        // ✅ Check if the order is still pending
        if (order.orderStatus !== "Pending") {
            return res.status(400).json({ message: "Order cannot be canceled after confirmation" });
        }

        // ✅ Update status to 'Cancelled'
        order.orderStatus = "Cancelled";
        await order.save();

        res.json({ message: "✅ Order has been cancelled successfully", order });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Fetch Vendor-Specific Orders
router.get("/vendor", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;

        if (userRole !== "vendor") {
            return res.status(403).json({ message: "Unauthorized: Vendors only" });
        }

        // ✅ Find orders where this vendor has products
        const orders = await Order.find({ vendorId: userId })
            .populate("customerId", "name email") // Get customer details
            .populate("productId", "name price"); // Get product details

        // ✅ Transform response for frontend
        const formattedOrders = orders.map((order) => ({
            _id: order._id,
            productName: order.productId.name,
            customerName: order.customerId.name,
            orderStatus: order.orderStatus,
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error("Error fetching vendor orders:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});



module.exports = router;
