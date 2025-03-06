import React from "react";
import { Container, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Check if user is logged in

    const handleBrowseProducts = () => {
        if (token) {
            navigate("/products"); // Go to products if logged in
        } else {
            navigate("/auth"); // Redirect to login/signup if not logged in
        }
    };

    return (
        <Container>
            <Typography variant="h3" align="center" gutterBottom>
                Welcome to MarketHub
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary">
                Your one-stop multi-vendor e-commerce platform!
            </Typography>
            <Grid container justifyContent="center" style={{ marginTop: "1rem" }}>
                <Button variant="contained" color="primary" onClick={handleBrowseProducts}>
                    Browse Products
                </Button>
            </Grid>
        </Container>
    );
}

export default Home;
