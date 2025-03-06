import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "../components/EditUserModal";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "customer" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users.");
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(users.filter(user => user._id !== userId));
            alert("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    const approveUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("User approved successfully!");
            fetchUsers();
        } catch (error) {
            console.error("Error approving user:", error);
            alert("Failed to approve user.");
        }
    };

    const rejectUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("User rejected successfully!");
            fetchUsers();
        } catch (error) {
            console.error("Error rejecting user:", error);
            alert("Failed to reject user.");
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/admin/users", newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("User created successfully!");
            setShowCreateForm(false);
            setNewUser({ name: "", email: "", password: "", role: "customer" });
            fetchUsers();
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user.");
        }
    };

    if (loading) return <p className="text-center mt-4">Loading users...</p>;
    if (error) return <p className="text-danger text-center mt-4">{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">👥 Manage Users</h2>

            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-success" onClick={() => setShowCreateForm(!showCreateForm)}>
                    {showCreateForm ? "Cancel" : "➕ Create User"}
                </button>
            </div>

            {showCreateForm && (
                <form onSubmit={createUser} className="bg-light p-4 rounded shadow-sm">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            required
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            required
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-select"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="customer">Customer</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Create</button>
                </form>
            )}

            {users.length === 0 ? (
                <p className="text-center mt-4">No users found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Verified</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge bg-${user.role === "admin" ? "danger" : user.role === "vendor" ? "warning" : "secondary"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {user.isVerified ? <span className="text-success">✅ Yes</span> : <span className="text-danger">❌ No</span>}
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => setSelectedUser(user)}>✏️ Edit</button>
                                        <button className="btn btn-sm btn-danger me-2" onClick={() => deleteUser(user._id)}>🗑 Delete</button>

                                        {user.role === "vendor" && user.status === "pending" && (
                                            <>
                                                <button className="btn btn-sm btn-success me-2" onClick={() => approveUser(user._id)}>✔ Approve</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => rejectUser(user._id)}>✖ Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={fetchUsers}
                />
            )}
        </div>
    );
};

export default AdminManageUsers;
