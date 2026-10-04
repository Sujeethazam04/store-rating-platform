const express = require("express");

const {
    getMyStore,
    getMyStoreRatings
} = require("../controllers/ownerController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================================
// GET MY STORE
// GET /api/owner/store
// ======================================================

router.get(
    "/store",
    authMiddleware,
    roleMiddleware("STORE_OWNER"),
    getMyStore
);


// ======================================================
// GET MY STORE RATINGS
// GET /api/owner/ratings
// ======================================================

router.get(
    "/ratings",
    authMiddleware,
    roleMiddleware("STORE_OWNER"),
    getMyStoreRatings
);


module.exports = router;