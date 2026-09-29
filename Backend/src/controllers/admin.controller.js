const mongoose = require("mongoose");

const Order = require("../models/order.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
//const Order = require("../models/order.model");
// Get all orders - admin
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.book", "title author image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

// Update order status - admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.status = status;

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("items.book", "title author image");

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        next(error);
    }
};

const getDashboard = async (req, res, next) => {
    try {
        const [
            totalBooks,
            totalOrders,
            totalCustomers,
            pendingOrders,
        ] = await Promise.all([
            Book.countDocuments(),
            Order.countDocuments(),
            User.countDocuments({ role: "customer" }),
            Order.countDocuments({ status: "pending" }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalBooks,
                totalOrders,
                totalCustomers,
                pendingOrders,
            },
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getDashboard,
    getAllOrders,
    updateOrderStatus,
};