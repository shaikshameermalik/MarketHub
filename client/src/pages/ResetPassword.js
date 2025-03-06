import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const tokenFromURL = searchParams.get("token");
        if (tokenFromURL) setToken(tokenFromURL);
        else setError("Invalid or missing token.");
    }, [searchParams]);

    const handleResetPassword = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/reset-password", { token, newPassword });
            setMessage(res.data.message);
            setError("");
            setTimeout(() => navigate("/auth"), 3000); // Redirect to login after success
        } catch (err) {
            setError(err.response?.data?.message || "Error resetting password.");
            setMessage("");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={10} style={{ padding: "2rem", textAlign: "center", marginTop: "50px" }}>
                <Typography variant="h5">Reset Password</Typography>
                <Typography variant="body2" color="textSecondary">
                    Enter a new password for your account.
                </Typography>
                <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleResetPassword}>
                    Reset Password
                </Button>
                {message && <Typography color="green">{message}</Typography>}
                {error && <Typography color="error">{error}</Typography>}
            </Paper>
        </Container>
    );
}

export default ResetPassword;
