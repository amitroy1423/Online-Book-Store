const express = require("express");

const {
    createOrder,
    getMyOrders,
    getMyOrderById,
} = require("../controllers/order.controller");

const {
    authUser,
    requireCustomer,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authUser, requireCustomer);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getMyOrderById);

module.exports = router;