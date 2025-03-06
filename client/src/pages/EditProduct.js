import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Spinner } from "react-bootstrap";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProductData(response.data);
            } catch (error) {
                setError("Failed to fetch product details");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, productData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate("/vendor-dashboard");
        } catch (error) {
            setError("Failed to update product");
        }
    };

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    }

    if (error) {
        return <p className="text-danger text-center mt-5">{error}</p>;
    }

    return (
        <Container className="mt-5 p-4 shadow-lg rounded bg-light">
            <h2 className="text-center mb-4">✏️ Edit Product</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} required />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Price (₹)</Form.Label>
                    <Form.Control type="number" name="price" value={productData.price} onChange={handleChange} required />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" value={productData.description} onChange={handleChange} required />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control type="text" name="category" value={productData.category} onChange={handleChange} required />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Stock Quantity</Form.Label>
                    <Form.Control type="number" name="stock" value={productData.stock} onChange={handleChange} required />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control type="text" name="image" value={productData.image} onChange={handleChange} required />
                </Form.Group>
                
                <Button variant="success" type="submit" className="w-100">Update Product</Button>
            </Form>
        </Container>
    );
};

export default EditProduct;