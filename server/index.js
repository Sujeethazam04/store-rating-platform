const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const ownerRoutes = require("./routes/ownerRoutes");


const app = express();

const PORT = process.env.PORT || 5000;

// Middleware


app.use(cors());
app.use(express.json());

//
// Test Route

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Store Rating Platform API is running"
    });
});

// Database Test Route

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS current_time");

        res.status(200).json({
            success: true,
            message: "Database connected successfully",
            time: result.rows[0].current_time
        });
    } catch (error) {
        console.error("Database test error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});


// Start Server

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});