import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const OrderForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    });

    const [loading, setLoading] = useState(false);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress({ ...shippingAddress, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(shippingAddress).some((val) => val.trim() === "")) {
            alert("Please fill in all address fields.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/orders",
                {
                    products: cart.map((item) => ({
                        productId: item.productId._id,
                        quantity: item.quantity
                    })),
                    totalAmount: totalPrice,
                    shippingAddress
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert("✅ Order placed successfully!");
            navigate("/orders");
        } catch (error) {
            console.error("Error placing order:", error);
            alert("❌ Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 p-4 shadow-lg rounded-4 bg-light">
            <h2 className="text-center text-primary fw-bold">Order Summary</h2>
            <div className="order-summary border rounded-3 p-3 bg-white mb-4">
                <h4 className="text-secondary">🛒 Items in Your Order:</h4>
                {cart.map((item) => (
                    <p key={item.productId._id} className="mb-1">
                        <strong>{item.productId.name}</strong> × {item.quantity} = 
                        <span className="text-success"> 💲{item.productId.price * item.quantity}</span>
                    </p>
                ))}
                <h3 className="fw-bold text-dark">Total: 💲{totalPrice.toFixed(2)}</h3>
            </div>

            <h3 className="text-center text-secondary">Shipping Address</h3>
            <form onSubmit={handleSubmit} className="border p-4 rounded bg-white shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="fullName" className="form-control" value={shippingAddress.fullName} onChange={handleAddressChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" name="address" className="form-control" value={shippingAddress.address} onChange={handleAddressChange} />
                </div>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">City</label>
                        <input type="text" name="city" className="form-control" value={shippingAddress.city} onChange={handleAddressChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">State</label>
                        <input type="text" name="state" className="form-control" value={shippingAddress.state} onChange={handleAddressChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Zip Code</label>
                        <input type="text" name="zipCode" className="form-control" value={shippingAddress.zipCode} onChange={handleAddressChange} />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input type="text" name="country" className="form-control" value={shippingAddress.country} onChange={handleAddressChange} />
                </div>
                
                <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
                    {loading ? "Placing Order..." : "Place Order"}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;
