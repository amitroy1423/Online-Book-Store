const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }

    next();
};

const requireCustomer = (req, res, next) => {
    if (req.user.role !== "customer") {
        return res.status(403).json({
            success: false,
            message: "Customer access required",
        });
    }

    next();
};

module.exports = {
    authUser,
    requireAdmin,
    requireCustomer,
};