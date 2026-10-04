const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

// REGISTER USER
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            password,
            role
        } = req.body;

        // ==========================================
        // ALLOWED PUBLIC ROLES
        // ==========================================

        const allowedRoles = [
            "USER",
            "STORE_OWNER"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message:
                    "Role must be USER or STORE_OWNER"
            });
        }


        // CHECK EMAIL

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // HASH PASSWORD

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // CREATE USER

        const result = await pool.query(
            `INSERT INTO users
            (
                name,
                email,
                password,
                address,
                role
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                name,
                email,
                address,
                role,
                created_at`,
            [
                name,
                email,
                hashedPassword,
                address,
                role
            ]
        );

        const user = result.rows[0];

        // GENERATE JWT

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // RESPONSE


        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user
        });

    } catch (error) {
        console.error(
            "Register error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error during registration"
        });
    }
};


// LOGIN USER

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const result = await pool.query(
            `SELECT id, name, email, password, address, role
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Don't send password to frontend
        delete user.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


// ==========================================
// UPDATE PASSWORD
// ==========================================

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Get current password
        const result = await pool.query(
            "SELECT password FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result.rows[0];

        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        await pool.query(
            `UPDATE users
             SET password = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [
                hashedPassword,
                userId
            ]
        );

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Update password error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating password"
        });
    }
};



// GET CURRENT USER

const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, address, role, created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Get current user error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    register,
    login,
    updatePassword,
    getMe
};