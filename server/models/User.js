const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
    {
        userId: { type: String, default: uuidv4, unique: true, required: true }, // ✅ Auto-generates unique userId
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["customer", "vendor", "admin"], default: "customer" },
        profileDetails: { type: Object, default: {} },
        verificationCode: { type: String },
        isVerified: { type: Boolean, default: false },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
