const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());

app.use(cors());

app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

// Job Routes
app.use("/api/jobs", jobRoutes);

// User Authentication Routes
app.use("/api/users", userRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("JobBoard API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Something went wrong on the server"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});