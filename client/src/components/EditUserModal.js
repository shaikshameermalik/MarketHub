import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditUserModal.css";

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role
    });

    useEffect(() => {
        setFormData({ name: user.name, email: user.email, role: user.role });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/admin/users/${user._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onUpdate();  // Refresh user list
            onClose();   // Close the modal
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>✏️ Edit User</h3>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                    </select>

                    <div className="modal-buttons">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
