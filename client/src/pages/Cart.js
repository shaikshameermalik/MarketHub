import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setCartId(response.data._id || null);
      
      // ✅ Filter out invalid products (if API didn't)
      const filteredProducts = response.data.products?.filter(item => item.productId) || [];
      setCart(filteredProducts);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const increaseQuantity = async (productId, currentQuantity) => {
    try {
      await axios.put(
        `http://localhost:5000/api/cart/update/${cartId}/${productId}`,
        { quantity: currentQuantity + 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchCart();
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const decreaseQuantity = async (productId, currentQuantity) => {
    try {
      if (currentQuantity === 1) {
        removeItem(productId);
      } else {
        await axios.put(
          `http://localhost:5000/api/cart/decrease/${cartId}/${productId}`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        fetchCart();
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cart.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0);

  const handleBuyNow = () => {
    navigate("/order", { state: { cart, totalPrice } });
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold text-uppercase text-primary">🛒 Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="alert alert-warning text-center shadow-sm p-3 rounded">Your cart is empty</div>
      ) : (
        <div className="row justify-content-center">
          {cart.map((item) => (
            <div key={item.productId?._id || Math.random()} className="col-md-8">
              <div className="card mb-3 shadow-lg border-0 rounded-4 p-3">
                <div className="row g-0 align-items-center">
                  <div className="col-md-4 text-center">
                    <img
                      src={item.productId?.image || "placeholder.jpg"}
                      alt={item.productId?.name || "No Name"}
                      className="img-fluid rounded-3"
                      style={{ maxHeight: "120px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-5">
                    <h5 className="mb-1 text-uppercase text-dark">{item.productId?.name || "Unknown Product"}</h5>
                    <p className="text-muted mb-2">💲{item.productId?.price || 0}</p>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary btn-sm fw-bold px-3 py-1" onClick={() => decreaseQuantity(item.productId?._id, item.quantity)}>➖</button>
                      <span className="mx-3 fs-5 fw-bold">{item.quantity}</span>
                      <button className="btn btn-outline-primary btn-sm fw-bold px-3 py-1" onClick={() => increaseQuantity(item.productId?._id, item.quantity)}>➕</button>
                    </div>
                  </div>
                  <div className="col-md-3 text-center">
                    <button className="btn btn-danger btn-sm w-100 mt-2 shadow-sm" onClick={() => removeItem(item.productId?._id)}>🗑️ Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="col-md-8 mt-4">
            <div className="card shadow-lg border-0 p-4 text-center">
              <h3 className="fw-bold text-success">Total: 💲{totalPrice.toFixed(2)}</h3>
              <button className="btn btn-gradient-primary btn-lg fw-bold mt-2" onClick={handleBuyNow}>
                🛍️ Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
