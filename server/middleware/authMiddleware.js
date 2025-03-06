const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("🔹 Received Auth Header:", authHeader); // Debug

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn("🚨 Missing or invalid token in header");
        return res.status(400).json({ message: "Unauthorized - No Token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("✅ Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        res.status(400).json({ message: "Unauthorized - Invalid Token" });
    }
};
