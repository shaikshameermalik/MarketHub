import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Select, MenuItem, CircularProgress
} from "@mui/material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "bootstrap/dist/css/bootstrap.min.css";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const fetchVendorOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchVendorOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-lg p-4">
        <h2 className="text-center mb-4 text-primary">📦 Manage Your Orders</h2>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <CircularProgress size={50} />
          </div>
        ) : orders.length === 0 ? (
          <div className="alert alert-warning text-center">No orders found.</div>
        ) : (
          <TableContainer component={Paper} className="table-responsive">
            <Table className="table table-striped table-hover align-middle">
              <TableHead className="bg-dark text-white">
                <TableRow>
                  <TableCell><b>Order ID</b></TableCell>
                  <TableCell><b>Product</b></TableCell>
                  <TableCell><b>Customer</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Update Status</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TransitionGroup component={null}>
                  {orders.map((order) => (
                    <CSSTransition key={order._id} timeout={500} classNames="fade">
                      <TableRow className="bg-light">
                        <TableCell>{order._id}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          <span className={`badge ${getBadgeClass(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            variant="outlined"
                            size="small"
                            className="form-select"
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Confirmed">Confirmed</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

// Function to get Bootstrap badge class based on order status
const getBadgeClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-warning text-dark";
    case "Confirmed":
      return "bg-primary";
    case "Shipped":
      return "bg-info";
    case "Delivered":
      return "bg-success";
    case "Cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

export default VendorOrders;
