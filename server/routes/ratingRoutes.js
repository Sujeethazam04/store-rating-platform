const express = require("express");

const {
    createRating,
    updateRating
} = require("../controllers/ratingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createRatingValidation,
    updateRatingValidation,
    handleValidationErrors
} = require("../validators/validation");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("USER"),
    createRatingValidation,
    handleValidationErrors,
    createRating
);

router.put(
    "/:storeId",
    authMiddleware,
    roleMiddleware("USER"),
    updateRatingValidation,
    handleValidationErrors,
    updateRating
);

module.exports = router;