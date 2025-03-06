import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleForgotPassword = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            setMessage(res.data.message);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Error sending reset email");
            setMessage("");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={10} style={{ padding: "2rem", textAlign: "center", marginTop: "50px" }}>
                <Typography variant="h5">Forgot Password</Typography>
                <Typography variant="body2" color="textSecondary">
                    Enter your email address to receive a password reset link.
                </Typography>
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleForgotPassword}>
                    Send Reset Link
                </Button>
                {message && <Typography color="green">{message}</Typography>}
                {error && <Typography color="error">{error}</Typography>}
            </Paper>
        </Container>
    );
}

export default ForgotPassword;
