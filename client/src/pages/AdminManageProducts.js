import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/admin/products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products.");
            setLoading(false);
        }
    };

    const approveProduct = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/admin/products/${productId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Product approved successfully!");
            fetchProducts();
        } catch (error) {
            console.error("Error approving product:", error);
            alert("Failed to approve product.");
        }
    };

    const rejectProduct = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://localhost:5000/api/admin/products/${productId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.data.message === "Product rejected successfully") {
                alert("Product rejected successfully!");
                fetchProducts();
            } else {
                alert("Failed to reject product.");
            }
        } catch (error) {
            console.error("Error rejecting product:", error);
            alert("Failed to reject product.");
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div> <p>Loading products...</p></div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">🛒 Manage Product Listings</h2>
            {products.length === 0 ? (
                <div className="alert alert-info text-center">No products found.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover shadow-sm">
                        <thead className="thead-dark">
                            <tr>
                                <th>Product Name</th>
                                <th>Vendor</th>
                                <th>Price</th>
                                <th>Approved</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="align-middle">
                                    <td>{product.name}</td>
                                    <td>{product.vendorName}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        {product.approved ? (
                                            <span className="badge badge-success">✅ Yes</span>
                                        ) : (
                                            <span className="badge badge-danger">❌ No</span>
                                        )}
                                    </td>
                                    <td>
                                        {!product.approved && (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-success btn-sm" onClick={() => approveProduct(product._id)}>
                                                    ✔ Approve
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => rejectProduct(product._id)}>
                                                    ✖ Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminManageProducts;
