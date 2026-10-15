
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("role");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (user.role !== "Admin") {
            return res.status(403).json({
                message: "Access denied. Admin only.",
                actualRole: user.role
            });
        }

        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        return res.status(500).json({
            message: "Server error."
        });
    }
};

module.exports = { protect, adminOnly };
