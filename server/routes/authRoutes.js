const express = require("express");

const {
    register,
    login,
    updatePassword,
    getMe
} = require("../controllers/authController");

const {
    registerValidation,
    passwordValidation,
    handleValidationErrors
} = require("../validators/validation");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================

router.post(
    "/register",
    registerValidation,
    handleValidationErrors,
    register
);


// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

router.post(
    "/login",
    login
);


// ==========================================
// UPDATE PASSWORD
// PUT /api/auth/password
// ==========================================

router.put(
    "/password",
    authMiddleware,
    passwordValidation,
    handleValidationErrors,
    updatePassword
);


// ==========================================
// GET CURRENT USER
// GET /api/auth/me
// ==========================================

router.get(
    "/me",
    authMiddleware,
    getMe
);


module.exports = router;