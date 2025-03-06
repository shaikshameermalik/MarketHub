import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const AddProduct = () => {
    const [productData, setProductData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        image: "",
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/products", productData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("✅ Product added successfully!");
            navigate("/vendor-dashboard");
        } catch (error) {
            toast.error("❌ Error adding product");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary fw-bold">➕ Add a New Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" className="form-control" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <input type="number" className="form-control" name="price" placeholder="Price (₹)" value={productData.price} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <textarea className="form-control" name="description" placeholder="Product Description" value={productData.description} onChange={handleChange} required />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <select className="form-select" name="category" value={productData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <input type="number" className="form-control" name="stock" placeholder="Stock Quantity" value={productData.stock} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" name="image" placeholder="Image URL" value={productData.image} onChange={handleChange} required />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-success w-100 fw-bold">✅ Add Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;