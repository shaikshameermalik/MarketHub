import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ question: "", answer: "" });
    const [editingId, setEditingId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const API_URL = "http://localhost:5000/api/faqs";
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const res = await axios.get(API_URL);
            setFaqs(res.data);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = { Authorization: `Bearer ${token}` };
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, formData, { headers });
            } else {
                await axios.post(API_URL, formData, { headers });
            }
            fetchFAQs();
            setShowModal(false);
            setFormData({ question: "", answer: "" });
            setEditingId(null);
        } catch (error) {
            console.error("Error saving FAQ:", error);
        }
    };

    const handleEdit = (faq) => {
        setFormData(faq);
        setEditingId(faq._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchFAQs();
        } catch (error) {
            console.error("Error deleting FAQ:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">FAQs</h2>

            {userRole === "admin" && (
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Add FAQ
                </Button>
            )}

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Answer</th>
                        {userRole === "admin" && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {faqs.map((faq) => (
                        <tr key={faq._id}>
                            <td>{faq.question}</td>
                            <td>{faq.answer}</td>
                            {userRole === "admin" && (
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(faq)}>
                                        Edit
                                    </Button>{" "}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(faq._id)}>
                                        Delete
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Adding/Editing FAQ */}
            {userRole === "admin" && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Question</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Answer</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" className="mt-3" variant="success">
                                {editingId ? "Update" : "Add"} FAQ
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default FAQPage;
