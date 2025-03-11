import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "../pages/SearchBar";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [unreadCount, setUnreadCount] = useState(0);
    let userRole = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchUnreadCount();
        }
    }, [token]);

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/notifications/unread", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error("Error fetching unread notifications:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg px-3">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold text-uppercase text-light" href="#" onClick={() => navigate("/")}>
                    <i className="bi bi-shop me-2 text-warning"></i>MarketHub
                </a>

                {/* ✅ Display Search Bar only if the user is a Customer */}
                {token && userRole === "customer" && (
                    <div className="ms-auto me-auto">
                        <SearchBar />
                    </div>
                )}

                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        {userRole !== "vendor" && (
                            <li className="nav-item">
                                <a className="nav-link text-light fw-semibold" href="#" onClick={() => navigate("/")}>
                                    <i className="bi bi-house-door me-1 text-primary"></i> Home
                                </a>
                            </li>
                        )}

                        {token && userRole === "vendor" && (
                            <li className="nav-item">
                                <a className="nav-link text-light fw-semibold" href="#" onClick={() => navigate("/vendor-orders")}>
                                    <i className="bi bi-box-seam me-1 text-success"></i> Manage Orders
                                </a>
                            </li>
                        )}

                        {token && userRole !== "admin" && (
                            <li className="nav-item">
                                <a className="nav-link text-light fw-semibold" href="#" onClick={() => navigate("/orders")}>
                                    <i className="bi bi-receipt-cutoff me-1 text-info"></i> Orders
                                </a>
                            </li>
                        )}

                        {token && (
                            <li className="nav-item">
                                <a className="nav-link text-light fw-semibold" href="#" onClick={() => navigate("/profile")}>
                                    <i className="bi bi-person-circle me-1 text-warning"></i> Profile
                                </a>
                            </li>
                        )}

                        {token && userRole === "customer" && (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link text-light fw-semibold" href="#" onClick={() => navigate("/cart")}>
                                        <i className="bi bi-cart me-1 text-danger"></i> Cart
                                    </a>
                                </li>
                               
                                <li className="nav-item">
                                    <a className="nav-link text-light fw-semibold" href="#" onClick={() => navigate("/livechat")}>
                                        <i className="bi bi-chat-dots me-1 text-info"></i> Live Chat
                                    </a>
                                </li>
                            </>
                        )}

                        {token && userRole === "vendor" && (
                            <li className="nav-item">
                                <a className="nav-link text-light fw-semibold" href="#" onClick={() => navigate("/vendor-dashboard")}>
                                    <i className="bi bi-speedometer2 me-1 text-warning"></i> Vendor Dashboard
                                </a>
                            </li>
                        )}

                        {token && userRole === "admin" && (
                            <li className="nav-item">
                                <a className="nav-link text-light fw-semibold" href="#" onClick={() => navigate("/admin")}>
                                    <i className="bi bi-shield-lock me-1 text-danger"></i> Admin Dashboard
                                </a>
                            </li>
                        )}
                    </ul>

                    {/* 🔔 Notifications Icon */}
                    {token && (
                        <button className="btn btn-outline-light me-3 position-relative" onClick={() => navigate("/notifications")}>
                            <i className="bi bi-bell fs-5"></i>
                            {unreadCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {unreadCount}
                                    <span className="visually-hidden">unread notifications</span>
                                </span>
                            )}
                        </button>
                    )}

                    {/* 🔹 Login / Logout Buttons */}
                    {token ? (
                        <button className="btn btn-danger px-4 py-2 fw-bold" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-1"></i> Logout
                        </button>
                    ) : (
                        <button className="btn btn-success px-4 py-2 fw-bold" onClick={() => navigate("/auth")}>
                            <i className="bi bi-person-plus me-1"></i> Login / Signup
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
