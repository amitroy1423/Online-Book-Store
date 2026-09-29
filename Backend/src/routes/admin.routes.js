const express = require("express");

const {
    createBook,
    updateBook,
    deleteBook,
} = require("../controllers/book.controller");

const {
    authUser,
    requireAdmin,
} = require("../middleware/auth.middleware");

const {
    getDashboard,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/admin.controller");

const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.use(authUser, requireAdmin);

router.post("/books", upload.single("image"), createBook);

router.patch(
    "/books/:id",
    upload.single("image"),
    updateBook
);

router.delete("/books/:id", deleteBook);

router.get("/orders", getAllOrders);

router.patch(
    "/orders/:id/status",
    updateOrderStatus
);
router.get("/dashboard", getDashboard);

module.exports = router;