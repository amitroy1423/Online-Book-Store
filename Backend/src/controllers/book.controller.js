const mongoose = require("mongoose");

const Book = require("../models/book.model");
const { uploadImage } = require("../services/imagekit.service");

// Get all books
const getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: books,
        });
    } catch (error) {
        next(error);
    }
};

// Get single book
const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
        }

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: book,
        });
    } catch (error) {
        next(error);
    }
};

// Create book - admin
const createBook = async (req, res, next) => {
    try {
        const {
            title,
            author,
            description,
            price,
            category,
        } = req.body;

        if (!title || !author || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Title, author and price are required",
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative",
            });
        }

        let imageUrl;

        if (req.file) {
            imageUrl = await uploadImage(req.file);
        }

        const book = await Book.create({
            title: title.trim(),
            author: author.trim(),
            description: description?.trim(),
            price: Number(price),
            image: imageUrl,
            category: category?.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {
        next(error);
    }
};

// Update book - admin
const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
        }

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        const {
            title,
            author,
            description,
            price,
            category,
        } = req.body;

        if (title !== undefined) {
            book.title = title.trim();
        }

        if (author !== undefined) {
            book.author = author.trim();
        }

        if (description !== undefined) {
            book.description = description.trim();
        }

        if (price !== undefined) {
            if (Number(price) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Price cannot be negative",
                });
            }

            book.price = Number(price);
        }

        if (category !== undefined) {
            book.category = category.trim();
        }

        // Replace image if a new one is uploaded
        if (req.file) {
            book.image = await uploadImage(req.file);
        }

        await book.save();

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    } catch (error) {
        next(error);
    }
};

// Delete book - admin
const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
        }

        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};