import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [refundReason, setRefundReason] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/admin/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/admin/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders(); // Refresh orders after update
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleResolveDispute = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleConfirmResolution = async () => {
        if (!selectedOrder) return;
    
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/admin/orders/${selectedOrder._id}/resolve`,
                { resolutionStatus: refundReason },  // Send refund reason to backend
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setShowModal(false);
            fetchOrders(); // Refresh orders list
        } catch (error) {
            console.error("Error resolving order dispute:", error);
        }
    };
    

    return (
        <div className="container mt-4">
            <h2 className="mb-3">All Orders</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>
                                {order.customerId
                                    ? `${order.customerId.name} (${order.customerId.email})`
                                    : "Unknown Customer"}
                            </td>
                            <td>
                                {order.products.map((p) => (
                                    <div key={p.productId?._id}>
                                        {p.productId
                                            ? `${p.productId.name} - ${p.quantity} pcs`
                                            : "Unknown Product"}
                                    </div>
                                ))}
                            </td>
                            <td>${order.totalAmount}</td>
                            <td>
                                <Form.Select
                                    value={order.orderStatus}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Disputed">Disputed</option>
                                </Form.Select>
                            </td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => updateOrderStatus(order._id, "Cancelled")}
                                >
                                    Cancel Order
                                </Button>
                                {order.orderStatus === "Disputed" && (
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => handleResolveDispute(order)}
                                    >
                                        Resolve Dispute
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Resolve Dispute Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Resolve Order Dispute</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form.Group>
            <Form.Label>Select Resolution</Form.Label>
            <Form.Select value={refundReason} onChange={(e) => setRefundReason(e.target.value)}>
                <option value="">Select Resolution</option>
                <option value="Refunded">Refunded</option>
                <option value="Disputed">Disputed</option>
                <option value="Cancelled">Cancelled</option>
            </Form.Select>
        </Form.Group>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
        <Button variant="primary" onClick={handleConfirmResolution}>Confirm Resolution</Button>
    </Modal.Footer>
</Modal>

        </div>
    );
};

export default AdminOrders;