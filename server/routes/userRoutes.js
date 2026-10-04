const express = require("express");

const {
    getUserStores
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// GET STORES

router.get(
    "/stores",
    authMiddleware,
    roleMiddleware("USER"),
    getUserStores
);


module.exports = router;