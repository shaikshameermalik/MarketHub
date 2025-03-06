import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function EmailVerified() {
    const navigate = useNavigate();

    return (
        <Container style={{ textAlign: "center", marginTop: "50px" }}>
            <Typography variant="h4" color="green">✅ Email Verified Successfully!</Typography>
            <Typography variant="body1">You can now log in to your account.</Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate("/auth")} 
                style={{ marginTop: "20px" }}
            >
                Go to Login
            </Button>
        </Container>
    );
}

export default EmailVerified;
