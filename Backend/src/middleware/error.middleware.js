const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Invalid MongoDB ObjectId
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }

    // Mongoose validation error
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map(
            (error) => error.message
        );

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0];

        return res.status(409).json({
            success: false,
            message: `${field || "Field"} already exists`,
        });
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;