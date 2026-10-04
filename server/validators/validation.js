const { body, validationResult } = require("express-validator");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 20, max: 60 })
        .withMessage("Name must be between 20 and 60 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ max: 400 })
        .withMessage("Address cannot exceed 400 characters"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 16 })
        .withMessage("Password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/;'`~+=]/)
        .withMessage("Password must contain at least one special character")
];

const passwordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8, max: 16 })
        .withMessage("New password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("New password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/;'`~+=]/)
        .withMessage("New password must contain at least one special character")
];

const adminCreateUserValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 20, max: 60 })
        .withMessage("Name must be between 20 and 60 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ max: 400 })
        .withMessage("Address cannot exceed 400 characters"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 16 })
        .withMessage("Password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/;'`~+=]/)
        .withMessage("Password must contain at least one special character"),

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["ADMIN", "USER", "STORE_OWNER"])
        .withMessage("Role must be ADMIN, USER, or STORE_OWNER")
];


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }

    next();
};

const createStoreValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Store name is required")
        .isLength({ min: 1, max: 60 })
        .withMessage("Store name cannot exceed 60 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Store email is required")
        .isEmail()
        .withMessage("Please enter a valid store email")
        .normalizeEmail(),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Store address is required")
        .isLength({ max: 400 })
        .withMessage("Store address cannot exceed 400 characters"),

    body("owner_id")
        .notEmpty()
        .withMessage("Store owner is required")
        .isInt({ min: 1 })
        .withMessage("Owner ID must be a valid number")
];

const createRatingValidation = [
    body("store_id")
        .notEmpty()
        .withMessage("Store ID is required")
        .isInt({ min: 1 })
        .withMessage("Store ID must be a valid number"),

    body("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5")
];

const updateRatingValidation = [
    body("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5")
];

module.exports = {
    registerValidation,
    passwordValidation,
    adminCreateUserValidation,
    handleValidationErrors,
    createStoreValidation,
    createRatingValidation,
    updateRatingValidation
};