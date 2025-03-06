import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
    return (
        <div className="container my-5">
            <div className="card shadow-lg border-0 rounded-lg p-4 text-center bg-light">
                <h2 className="text-primary mb-4 fw-bold">🛠️ Admin Dashboard</h2>

                <div className="row g-4">
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/users" className="btn btn-outline-primary shadow-sm p-4 w-100 rounded">
                            👥 <span className="fw-bold">Manage Users</span>
                        </Link>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/orders" className="btn btn-outline-success shadow-sm p-4 w-100 rounded">
                            📦 <span className="fw-bold">Manage Orders</span>
                        </Link>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/products" className="btn btn-outline-warning shadow-sm p-4 w-100 rounded">
                            📊 <span className="fw-bold">Products</span>
                        </Link>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/audits" className="btn btn-outline-secondary shadow-sm p-4 w-100 rounded">
                            ⚙️ <span className="fw-bold">Audit Logs</span>
                        </Link>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <Link to="/admin/faqs" className="btn btn-outline-info shadow-sm p-4 w-100 rounded">
                            ❓ <span className="fw-bold">Manage FAQs</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
