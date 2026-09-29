const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const errorHandler = require("./middleware/error.middleware");
const bookRouter = require("./routes/book.routes");
const adminRouter = require("./routes/admin.routes");
const orderRouter = require("./routes/order.routes");
const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", orderRouter);

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Online Book Store API is running",
    });
});

// Error handler must be last
app.use(errorHandler);

module.exports = app;