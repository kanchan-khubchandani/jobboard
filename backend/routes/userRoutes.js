
const express = require("express");

const {
    register,
    login,
    getProfile,
    getAdminDashboard
} = require("../controllers/userController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Authenticated user route
router.get("/profile", protect, getProfile);

// Admin-only route
router.get(
    "/admin",
    protect,
    adminOnly,
    getAdminDashboard
);

module.exports = router;
