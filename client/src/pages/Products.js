import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Alert, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cartMessage, setCartMessage] = useState(""); // ✅ Success/Error Message for Cart
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth"); // ✅ Redirect if not logged in
            return;
        }

        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/products", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(res.data);
            } catch (err) {
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [navigate]);

    // ✅ Add Product to Cart Function
    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:5000/api/cart/add",
                { productId, quantity: 1 }, // ✅ Send Product ID & Quantity
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCartMessage("Product added to cart successfully! 🛒");
            setTimeout(() => setCartMessage(""), 3000); // Hide message after 3 sec
        } catch (err) {
            setCartMessage("Failed to add product to cart. Try again!");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container sx={{ marginTop: "20px" }}>
            <Typography variant="h4" gutterBottom>Available Products</Typography>

            {/* ✅ Show Cart Message */}
            {cartMessage && <Alert severity="success">{cartMessage}</Alert>}

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.image || "https://via.placeholder.com/150"} 
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography color="textSecondary">${product.price}</Typography>

                                {/* ✅ Add to Cart Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginTop: "10px", marginRight: "10px" }}
                                    onClick={() => addToCart(product._id)}
                                >
                                    🛒 Add to Cart
                                </Button>

                                {/* ✅ View Details Link */}
                                <Link to={`/product/${product._id}`}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ marginTop: "10px" }}
                                    >
                                        📄 View Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Products;
