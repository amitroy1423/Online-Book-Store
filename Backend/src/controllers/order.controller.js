const mongoose = require("mongoose");

const Order = require("../models/order.model");
const Book = require("../models/book.model");

// Create order - customer
const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item",
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required",
            });
        }

        const requiredAddressFields = [
            "fullName",
            "phone",
            "address",
            "city",
            "state",
            "pincode",
        ];

        for (const field of requiredAddressFields) {
            if (!shippingAddress[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`,
                });
            }
        }

        // Validate and normalize requested items
        const normalizedItems = [];

        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.book)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid book ID",
                });
            }

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be at least 1",
                });
            }

            normalizedItems.push({
                book: item.book,
                quantity,
            });
        }

        // Fetch actual books from database
        const bookIds = normalizedItems.map((item) => item.book);

        const books = await Book.find({
            _id: { $in: bookIds },
        });

        if (books.length !== bookIds.length) {
            return res.status(404).json({
                success: false,
                message: "One or more books were not found",
            });
        }

        const bookMap = new Map(
            books.map((book) => [book._id.toString(), book])
        );

        let totalAmount = 0;

        const orderItems = normalizedItems.map((item) => {
            const book = bookMap.get(item.book.toString());

            const itemTotal = book.price * item.quantity;

            totalAmount += itemTotal;

            return {
                book: book._id,
                title: book.title,
                price: book.price,
                quantity: item.quantity,
            };
        });

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress: {
                fullName: shippingAddress.fullName.trim(),
                phone: shippingAddress.phone.trim(),
                address: shippingAddress.address.trim(),
                city: shippingAddress.city.trim(),
                state: shippingAddress.state.trim(),
                pincode: shippingAddress.pincode.trim(),
            },
            status: "pending",
            paymentMethod: "cash_on_delivery",
        });

        const populatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("items.book", "title author image");

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: populatedOrder,
        });
    } catch (error) {
        next(error);
    }
};

// Get logged-in customer's orders
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: req.user.id,
        })
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

// Get one customer's order
const getMyOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await Order.findOne({
            _id: id,
            user: req.user.id,
        })
            .populate("user", "name email")
            .populate("items.book", "title author image");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getMyOrderById,
};