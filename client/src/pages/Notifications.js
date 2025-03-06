import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import MarkAsReadIcon from "@mui/icons-material/Done";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchNotifications(); // 🔥 Refetch to get updated notifications
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Notifications</h2>
            <List>
                {notifications.length === 0 ? (
                    <p>No notifications available.</p>
                ) : (
                    notifications.map((notification) => (
                        <ListItem 
                            key={notification._id} 
                            sx={{ backgroundColor: notification.readStatus ? "white" : "#f0f0f0", marginBottom: "5px" }} // ✅ Fixed readStatus check
                        >
                            <ListItemText primary={notification.message} />
                            {!notification.readStatus && ( // ✅ Fixed condition to check readStatus
                                <IconButton onClick={() => markAsRead(notification._id)}>
                                    <MarkAsReadIcon />
                                </IconButton>
                            )}
                        </ListItem>
                    ))
                )}
            </List>
        </div>
    );
}

export default Notifications;
