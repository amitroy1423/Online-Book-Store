const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "Order must contain at least one item",
            },
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
                trim: true,
            },

            phone: {
                type: String,
                required: true,
                trim: true,
            },

            address: {
                type: String,
                required: true,
                trim: true,
            },

            city: {
                type: String,
                required: true,
                trim: true,
            },

            state: {
                type: String,
                required: true,
                trim: true,
            },

            pincode: {
                type: String,
                required: true,
                trim: true,
            },
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        paymentMethod: {
            type: String,
            enum: ["cash_on_delivery"],
            default: "cash_on_delivery",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;