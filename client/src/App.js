import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import VendorDashboard from "./pages/VendorDashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./pages/Cart";
import OrderForm from "./pages/OrderForm";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import VendorOrders from "./pages/VendorOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageUsers from "./pages/AdminManageUsers";
import AdminManageProducts from "./pages/AdminManageProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminAudits from "./pages/AdminAudits";
import Notifications from "./pages/Notifications";
import FAQPage from "./pages/FAQPage";
import LiveChat from "./components/LiveChat";
import VendorSalesReport from "./pages/VendorSalesReport";


const Products = lazy(() => import("./pages/Products"));
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const EmailVerified = lazy(() => import("./pages/EmailVerified"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));


function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/auth" />;
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                    <Route path="/vendor-dashboard" element={<PrivateRoute role="vendor"><VendorDashboard /></PrivateRoute>} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/add-product" element={<PrivateRoute role="vendor"><AddProduct /></PrivateRoute>} />
                    <Route path="/edit-product/:id" element={<PrivateRoute role="vendor"><EditProduct /></PrivateRoute>} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/email-verified" element={<EmailVerified />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="/order" element={<OrderForm />} />
                    <Route path="/orders" element={<Orders/>} /> 
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/vendor-orders" element={<VendorOrders />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminManageUsers />} />
                    <Route path="/admin/products" element={<AdminManageProducts/>} />
                    <Route path="/admin/orders" element={<AdminOrders/>} />
                    <Route path="/admin/audits" element={<AdminAudits/>} />
                    <Route path="/notifications" element={<Notifications/>} />
                    <Route path="admin/faqs" element={<FAQPage />} />
                    <Route path="/livechat" element={<LiveChat />} />
                    <Route path="/vendor/sales-report/:vendorId" element={<VendorSalesReport />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
