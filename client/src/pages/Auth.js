import React, { useState } from "react";
import {TextField, Button, Typography, Paper, Grid, IconButton, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Google, Facebook, ShoppingCart } from "@mui/icons-material"; // ✅ Import ShoppingCart icon
import axios from "axios";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ For navigation

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("customer"); // ✅ Default role
    const [error, setError] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // ✅ Check if user is logged in

    // 🔹 Handle Signup/Login
    const handleAuth = async () => {
        try {
            const url = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/signup";
            const payload = isLogin 
                ? { email, password } 
                : { name, email, password, role, profileDetails: { phone, address } };
    
            const res = await axios.post(url, payload);
    
            if (!isLogin) {
                setSuccessMessage("✅ Registration successful! Check your email to verify your account.");
            } else {
                console.log("🔹 Login Response:", res.data);  // ✅ Debug log
    
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.user.role); // ✅ Store user role
                localStorage.setItem("vendorId", res.data.user._id);
                console.log("🔹 Token Stored:", res.data.token);
                console.log("🔹 Role Stored:", res.data.user.role);
    
                // ✅ Redirect based on role
                if (res.data.user.role === "customer") {
                    navigate("/products");
                } else if (res.data.user.role === "vendor") {
                    navigate("/vendor-dashboard"); // ✅ Correct vendor redirection
                } else {
                    navigate("/admin-dashboard"); // For future admin panel
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed");
        }
    };

    return (
        <Box sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={10} sx={{
                    padding: "2.5rem",
                    borderRadius: "15px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    maxWidth: "400px",
                }}>
                    <Typography variant="h4" gutterBottom>
                        {isLogin ? "Welcome Back!" : "Join MarketHub"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, marginBottom: "1rem" }}>
                        {isLogin ? "Login to continue" : "Create an account"}
                    </Typography>

                    {/* 🔹 Show success message if available */}
                    {successMessage && (
                        <Typography variant="body1" sx={{ color: "green", fontWeight: "bold", marginBottom: "10px" }}>
                            {successMessage}
                        </Typography>
                    )}

                    {/* 🔹 Show error message if there's an error */}
                    {error && <Typography color="error">{error}</Typography>}

                    {!isLogin && (
                        <>
                            <TextField fullWidth label="Full Name" variant="filled" sx={{ backgroundColor: "#fff", borderRadius: "10px", marginBottom: "10px" }} value={name} onChange={(e) => setName(e.target.value)} />
                            <TextField fullWidth label="Phone Number" variant="filled" sx={{ backgroundColor: "#fff", borderRadius: "10px", marginBottom: "10px" }} value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <TextField fullWidth label="Address" variant="filled" sx={{ backgroundColor: "#fff", borderRadius: "10px", marginBottom: "10px" }} value={address} onChange={(e) => setAddress(e.target.value)} />

                            {/* 🔹 Role Selection Dropdown (Fixed) */}
                            <FormControl fullWidth variant="filled" sx={{ backgroundColor: "#fff", borderRadius: "10px", marginBottom: "10px" }}>
                                <InputLabel>Role</InputLabel>
                                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <MenuItem value="customer">Customer</MenuItem>
                                    <MenuItem value="vendor">Vendor</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}

                    <TextField fullWidth label="Email" variant="filled" sx={{ backgroundColor: "#fff", borderRadius: "10px", marginBottom: "10px" }} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField fullWidth label="Password" type="password" variant="filled" sx={{ backgroundColor: "#fff", borderRadius: "10px", marginBottom: "10px" }} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button fullWidth variant="contained" sx={{
                        marginTop: "1rem",
                        borderRadius: "10px",
                        background: "#ff4081",
                        "&:hover": { background: "#d81b60" },
                    }} onClick={handleAuth}>
                        {isLogin ? "Login" : "Signup"}
                    </Button>

                    {/* 🔹 Forgot Password - Redirect to dedicated page */}
                    <Typography variant="body2" sx={{ marginTop: "1rem", cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/forgot-password")}>
                        Forgot Password?
                    </Typography>

                    <Typography variant="body2" sx={{ marginTop: "1rem", cursor: "pointer", textDecoration: "underline" }} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
                    </Typography>

                    {/* 🔹 Cart Button - Only show if logged in */}
                    {token && (
                        <Button
                            variant="contained"
                            sx={{ marginTop: "1rem", background: "#fbc02d", "&:hover": { background: "#f9a825" } }}
                            startIcon={<ShoppingCart />}
                            onClick={() => navigate("/cart")}
                        >
                            View Cart
                        </Button>
                    )}

                    {/* Social Login */}
                    <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                        Or continue with
                    </Typography>
                    <Grid container justifyContent="center" spacing={2} sx={{ marginTop: "1rem" }}>
                        <Grid item>
                            <IconButton sx={{ background: "#fff", borderRadius: "50%", padding: "10px" }} onClick={() => signInWithPopup(auth, googleProvider)}>
                                <Google sx={{ color: "#DB4437" }} />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton sx={{ background: "#fff", borderRadius: "50%", padding: "10px" }} onClick={() => signInWithPopup(auth, facebookProvider)}>
                                <Facebook sx={{ color: "#4267B2" }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>
        </Box>
    );
}

export default Auth;
