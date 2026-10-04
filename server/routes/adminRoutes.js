const express = require("express");

const {
    getDashboardStats,
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    createStore,
    getAllStores,
    updateStore,
    deleteStore

} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    adminCreateUserValidation,
    createStoreValidation,
    handleValidationErrors
} = require("../validators/validation");

const router = express.Router();

// ======================================================
// ADMIN DASHBOARD
// ======================================================

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getDashboardStats
);

// GET ALL USERS

router.get(
    "/users",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllUsers
);

// CREATE USER


router.post(
    "/users",
    authMiddleware,
    roleMiddleware("ADMIN"),
    adminCreateUserValidation,
    handleValidationErrors,
    createUser
);


// GET USER BY ID

router.get(
    "/users/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getUserById
);

router.put(
    "/users/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateUser
);

router.delete(
    "/users/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteUser
);

// CREATE STORE


router.post(
    "/stores",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createStoreValidation,
    handleValidationErrors,
    createStore
);

// GET ALL STORES
//

router.get(
    "/stores",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllStores
);

// UPDATE STORE


router.put(
    "/stores/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createStoreValidation,
    handleValidationErrors,
    updateStore
);

// DELETE STORE

router.delete(
    "/stores/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteStore
);

module.exports = router;