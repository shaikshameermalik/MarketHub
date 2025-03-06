import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const VendorSalesReport = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!vendorId || vendorId === "undefined") {
            console.error("❌ Invalid Vendor ID!");
            setError("Vendor ID is missing or invalid.");
            setLoading(false);
            return;
        }

        const fetchSalesReport = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/vendors/sales-report/${vendorId}`);
                setSalesData(response.data);
            } catch (error) {
                console.error("❌ Error fetching sales data:", error);
                setError("Failed to fetch sales data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesReport();
    }, [vendorId]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p>Loading sales report...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center mt-4">{error}</div>
        );
    }

    if (!salesData) {
        return (
            <div className="text-center mt-4">
                <p>No sales data available.</p>
            </div>
        );
    }

    const { totalSales, totalRevenue, salesByMonth } = salesData;

    // Convert salesByMonth to chart format
    const chartData = salesByMonth
        ? Object.keys(salesByMonth).map(month => ({
            month,
            sales: salesByMonth[month],
        }))
        : [];

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">📊 Vendor Sales Report</h1>

            {/* Sales Summary */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Sales</h5>
                            <p className="display-5 fw-bold text-success">{totalSales}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Revenue</h5>
                            <p className="display-5 fw-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Chart */}
            <h2 className="text-center mb-3">📅 Sales by Month</h2>
            <div className="card shadow-sm border-0 p-3">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#007bff" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-muted">No sales data available for this period.</p>
                )}
            </div>

            {/* Back Button */}
            <div className="text-center mt-4">
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>🔙 Back</button>
            </div>
        </div>
    );
};

export default VendorSalesReport;
