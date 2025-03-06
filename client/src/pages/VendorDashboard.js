import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const VendorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vendorId, setVendorId] = useState(null);  // Store vendorId in state
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const storedVendorId = localStorage.getItem("vendorId");
        
        if (!storedVendorId) {
            console.error("❌ Vendor ID is missing! Redirecting...");
            navigate("/login");
            return;
        }

        setVendorId(storedVendorId); // Update state with vendor ID

        const fetchVendorProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products?vendorId=${storedVendorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching vendor products:", error);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchVendorProducts();
    }, [token, navigate]);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error);
            setError("Failed to delete the product.");
        }
    };

    // 🔹 Fix: Ensure vendorId is available before navigating
    const handleViewSalesReport = () => {
        const storedVendorId = localStorage.getItem("vendorId");
    
        if (!storedVendorId) {
            console.error("❌ Vendor ID is missing! Check login process.");
            return;
        }
    
        console.log("✅ Navigating to:", `/vendor/sales-report/${storedVendorId}`);
        navigate(`/vendor/sales-report/${storedVendorId}`);
    };
    

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">📦 Vendor Dashboard</h2>
                <div>
                    <button 
                        className="btn btn-info fw-bold me-2" 
                        onClick={handleViewSalesReport} // 🔹 Now safely using vendorId
                        disabled={!vendorId} // Disable button if vendorId is missing
                    >
                        📊 View Sales Report
                    </button>
                    <Link to="/add-product" className="btn btn-success fw-bold">
                        ➕ Add New Product
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-muted">🔄 Loading products...</div>
            ) : error ? (
                <div className="text-center text-danger">{error}</div>
            ) : (
                <div className="row mt-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="col-md-4 mb-4">
                                <div className="card shadow-sm h-100">
                                    <img src={product.image} alt={product.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                                    <div className="card-body">
                                        <h5 className="card-title text-dark">{product.name}</h5>
                                        <p className="card-text text-muted">${product.price}</p>
                                        <p className="card-text">
                                            <span className="badge bg-info">{product.category}</span>
                                        </p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between">
                                        <Link to={`/edit-product/${product._id}`} className="btn btn-warning btn-sm">
                                            ✏️ Edit
                                        </Link>
                                        <button onClick={() => handleDelete(product._id)} className="btn btn-danger btn-sm">
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-muted">No products found. Add some products!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VendorDashboard;
