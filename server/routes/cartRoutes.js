const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Add to Cart
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "✅ Product added to cart", cart });
  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 📌 Get Cart Items for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("products.productId");
    if (!cart) return res.status(200).json({ message: "Cart is empty", products: [] });
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 📌 Remove Item from Cart
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();
    
    res.status(200).json({ message: "✅ Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 📌 Clear Cart after Order is Placed
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.userId });
    res.status(200).json({ message: "✅ Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/increase/:cartId/:productId", async (req, res) => {
  try {
      const { cartId, productId } = req.params;

      // Find the cart
      const cart = await Cart.findById(cartId);
      if (!cart) {
          return res.status(404).json({ error: "Cart not found" });
      }

      // Find the product in the cart
      const product = cart.products.find((p) => p.productId.toString() === productId);
      if (!product) {
          return res.status(404).json({ error: "Product not found in cart" });
      }

      // Increment quantity
      product.quantity += 1;
      await cart.save();

      res.json({ message: "Product quantity increased", cart });
  } catch (error) {
      console.error("Error increasing product quantity:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Decrement Product Quantity in Cart
router.put("/decrease/:cartId/:productId", async (req, res) => {
  try {
      const { cartId, productId } = req.params;

      // Find the cart
      const cart = await Cart.findById(cartId);
      if (!cart) {
          return res.status(404).json({ error: "Cart not found" });
      }

      // Find the product in the cart
      const product = cart.products.find((p) => p.productId.toString() === productId);
      if (!product) {
          return res.status(404).json({ error: "Product not found in cart" });
      }

      // Decrement quantity (remove if 1)
      if (product.quantity > 1) {
          product.quantity -= 1;
      } else {
          cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
      }

      await cart.save();

      res.json({ message: "Product quantity decreased", cart });
  } catch (error) {
      console.error("Error decreasing product quantity:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



router.put("/update/:cartId/:productId", async (req, res) => {
  try {
      const { cartId, productId } = req.params;
      const { quantity } = req.body; // User-defined quantity

      if (!quantity || quantity < 1) {
          return res.status(400).json({ error: "Quantity must be at least 1" });
      }

      // Find the cart
      const cart = await Cart.findById(cartId);
      if (!cart) {
          return res.status(404).json({ error: "Cart not found" });
      }

      // Find the product in the cart
      const product = cart.products.find((p) => p.productId.toString() === productId);
      if (!product) {
          return res.status(404).json({ error: "Product not found in cart" });
      }

      // Update the quantity
      product.quantity = quantity;

      await cart.save();

      res.json({ message: "Product quantity updated", cart });
  } catch (error) {
      console.error("Error updating product quantity:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
