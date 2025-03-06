import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Modal, ProgressBar } from "react-bootstrap";
import { motion } from "framer-motion";

const steps = ["Pending", "Processing", "Shipped", "Delivered"];

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/orders/${orderId}/cancel`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(prevOrders => prevOrders.map(order => 
                order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
            ));
            setShowModal(false);
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    const openCancelDialog = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <Container className="mt-5 p-4 shadow-lg rounded-4 bg-light">
            <h2 className="text-center text-primary fw-bold mb-4">Your Orders</h2>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                orders.length === 0 ? (
                    <h5 className="text-danger text-center">No orders found.</h5>
                ) : (
                    orders.map((order) => (
                        <motion.div 
                            key={order._id} 
                            whileHover={{ scale: 1.02 }} 
                            className="card border-primary mb-3 p-3 shadow"
                        >
                            <h5 className="text-info fw-bold">Order ID: {order._id}</h5>
                            <p><strong>Full Name:</strong> {order.shippingAddress?.fullName}</p>
                            <p><strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                            <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                            <p className={`fw-bold ${order.orderStatus === "Cancelled" ? "text-danger" : "text-success"}`}>
                                <strong>Status:</strong> {order.orderStatus}
                            </p>
                            <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            
                            {/* Progress Bar for Order Status */}
                            <ProgressBar 
                                animated now={(steps.indexOf(order.orderStatus) + 1) * 25} 
                                label={order.orderStatus} 
                                variant={order.orderStatus === "Cancelled" ? "danger" : "primary"} 
                                className="mb-3"
                            />

                            {/* Cancel Button for Pending Orders */}
                            {order.orderStatus === "Pending" && (
                                <Button variant="outline-danger" onClick={() => openCancelDialog(order)} className="mt-2">
                                    Cancel Order
                                </Button>
                            )}
                        </motion.div>
                    ))
                )
            )}

            {/* Cancel Order Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <div className="modal-content bg-danger text-white">
                    <div className="modal-header">
                        <h5 className="modal-title">Cancel Order</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to cancel this order?</p>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>No</Button>
                        <Button variant="light" onClick={() => handleCancelOrder(selectedOrder._id)}>Yes, Cancel</Button>
                    </div>
                </div>
            </Modal>
        </Container>
    );
}

export default Orders;
