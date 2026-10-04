const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Check user role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission to access this resource."
            });
        }

        next();
    };
};

module.exports = roleMiddleware;