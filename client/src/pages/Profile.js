import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container, Card, CardContent, Avatar, CircularProgress, Alert,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ name: "", phone: "", address: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated. Please login.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:5000/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data);
                setUpdatedUser({
                    name: response.data.name || "",
                    phone: response.data.profileDetails?.phone || "",
                    address: response.data.profileDetails?.address || ""
                });
            } catch (err) {
                setError("Failed to fetch profile details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditClick = () => setEditOpen(true);
    const handleClose = () => setEditOpen(false);
    const handleChange = (e) => setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:5000/api/auth/profile",
                { name: updatedUser.name, profileDetails: { phone: updatedUser.phone, address: updatedUser.address } },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUser(response.data);
            setMessage("✅ Profile updated successfully!");
            setTimeout(() => setMessage(""), 3000);
            handleClose();
        } catch (err) {
            setError("❌ Failed to update profile.");
        }
    };

    if (loading) return <CircularProgress className="d-block mx-auto mt-5" />;
    if (error) return <Alert severity="error" className="text-center">{error}</Alert>;

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card className="shadow-lg border-0 rounded-4 p-4 text-center" style={{ width: "400px" }}>
                <Avatar className="mx-auto mb-3 bg-primary text-white" style={{ width: 80, height: 80, fontSize: "2rem" }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </Avatar>
                <CardContent>
                    <h3 className="fw-bold">{user.name}</h3>
                    <p className="text-muted mb-2">{user.email}</p>
                    
                    {user.profileDetails && (
                        <>
                            <p className="fw-light">
                                <strong className="text-primary">📞 Phone:</strong> {user.profileDetails.phone || "N/A"}
                            </p>
                            <p className="fw-light">
                                <strong className="text-primary">📍 Address:</strong> {user.profileDetails.address || "N/A"}
                            </p>
                        </>
                    )}

                    <Button 
                        variant="contained" 
                        color="primary" 
                        className="mt-3 px-4 shadow-sm"
                        onClick={handleEditClick}
                    >
                        ✏️ Edit Profile
                    </Button>

                    {message && <Alert severity="success" className="mt-3">{message}</Alert>}
                </CardContent>
            </Card>

            {/* Edit Profile Modal */}
            <Dialog open={editOpen} onClose={handleClose}>
                <DialogTitle className="fw-bold text-primary">Edit Profile</DialogTitle>
                <DialogContent className="p-4">
                    <TextField fullWidth margin="dense" label="Full Name" name="name" value={updatedUser.name} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Phone" name="phone" value={updatedUser.phone} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Address" name="address" value={updatedUser.address} onChange={handleChange} />
                </DialogContent>
                <DialogActions className="p-3">
                    <Button onClick={handleClose} className="btn btn-outline-secondary">Cancel</Button>
                    <Button onClick={handleSave} className="btn btn-primary px-4">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Profile;
