"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
exports.bookRoutes = express_1.default.Router();
// create a book
exports.bookRoutes.post("/api/books", async (req, res) => {
    try {
        const body = req.body;
        const book = await book_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Books created successfully",
            book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error,
        });
    }
});
// bookRoutes.post("/api/books", async (req: Request, res: Response) => {
//   try {
//     const body = req.body;
//     console.log("Received body:", body); 
//     console.log("Attempting to create book with Mongoose..."); // <-- NEW LOG
//     const book = await Book.create(body); 
//     console.log("Book created successfully by Mongoose (server-side):", book); // <-- NEW LOG
//     res.status(201).json({
//       success: true,
//       message: "Books created successfully",
//       book,
//     });
//   } catch (error: any) {
//     // Keep this detailed error logging from previous suggestions
//     console.error("--- SERVER-SIDE ERROR DURING BOOK CREATION ---");
//     console.error("Error type:", error.name);
//     console.error("Error message:", error.message);
//     if (error.errors) {
//       console.error("Validation details:");
//       for (const key in error.errors) {
//         if (error.errors.hasOwnProperty(key)) {
//           const validationError = error.errors[key];
//           console.error(`  Field: ${validationError.path}, Kind: ${validationError.kind}, Value: ${validationError.value}, Message: ${validationError.message}`);
//         }
//       }
//     } else {
//       console.error("Other error details (full object):", error);
//     }
//     console.error("---------------------------------------------");
//     res.status(400).json({
//       message: error.message || "Validation failed", // Use error.message for more detail
//       success: false,
//       error: error.message || "An unknown server error occurred.",
//       details: error.errors || null,
//     });
//   }
// });
// get all books
// bookRoutes.get(
//   "/api/books",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { genre, sortBy, sort, limit } = req.query;
//       const findQuery: { [key: string]: any } = {};
//       const sortOptions: { [key: string]: 1 | -1 } = {};
//       let limitValue = 10;
//       if (typeof genre === "string") {
//         findQuery.genre = genre.toUpperCase();
//       }
//       const actualSortBy = typeof sortBy === "string" ? sortBy : "createdAt";
//       sortOptions[actualSortBy] =
//         sort === "desc" || sort === "descending" ? -1 : 1;
//       if (typeof limit === "string") {
//         const parsedLimit = parseInt(limit, 10);
//         if (!isNaN(parsedLimit) && parsedLimit > 0) {
//           limitValue = parsedLimit;
//         }
//       }
//       const books = await Book.find(findQuery)
//         .sort(sortOptions)
//         .limit(limitValue);
//       res.status(200).json({
//         success: true,
//         message: "Books fetched successfully",
//         books,
//       });
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         error,
//       });
//     }
//   }
// );
// get a single book
// src/app/controllers/book.controller.ts (or wherever bookRoutes is defined)
exports.bookRoutes.get("/api/books", async (req, res) => {
    try {
        const { genre, sortBy, sort } = req.query; // Removed 'limit' from destructuring
        const findQuery = {};
        const sortOptions = {};
        // Removed: let limitValue = 10;
        if (typeof genre === "string") {
            findQuery.genre = genre.toUpperCase();
        }
        const actualSortBy = typeof sortBy === "string" ? sortBy : "createdAt";
        sortOptions[actualSortBy] =
            sort === "desc" || sort === "descending" ? -1 : 1;
        // Removed the 'limit' parsing block
        const books = await book_model_1.Book.find(findQuery)
            .sort(sortOptions); // Removed .limit(limitValue)
        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            books,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            error,
        });
    }
});
exports.bookRoutes.get("/api/books/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await book_model_1.Book.findOne({ _id: bookId });
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error,
        });
    }
});
// update a single book
exports.bookRoutes.put("/api/books/:bookId", async (req, res) => {
    try {
        const updatedBody = req.body;
        const bookId = req.params.bookId;
        // console.log(bookId)
        const updatedBook = await book_model_1.Book.findByIdAndUpdate(bookId, updatedBody, {
            new: true,
            runValidators: true,
        });
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error,
        });
    }
});
// delete a book
exports.bookRoutes.delete("/api/books/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const deleteBook = await book_model_1.Book.findByIdAndDelete(bookId);
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: deleteBook,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error,
        });
    }
});
// borrow books
// bookRoutes.post(
//   "/api/borrow/",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { book, quantity, dueDate } = req.body;
//       const foundBook = await Book.findById(book);
//       if (!foundBook) {
//         res.status(404).json({
//           success: false,
//           message: "Book not found!",
//         });
//         return;
//       }
//       // await foundBook.borrowBook(quantity);
//       const data = await Borrow.create({ book, quantity, dueDate });
//       res.status(201).json({
//         success: true,
//         message: "Book borrowed successfully",
//         data: data,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "verification failed",
//         error: error,
//       });
//     }
//   }
// );
exports.bookRoutes.post("/api/borrow/", async (req, res) => {
    try {
        const { book, quantity, dueDate } = req.body;
        const foundBook = await book_model_1.Book.findById(book);
        if (!foundBook) {
            res.status(404).json({
                success: false,
                message: "Book not found!",
            });
            return;
        }
        // 1. Availability verification
        if (foundBook.copies < quantity) {
            res.status(400).json({
                success: false,
                message: "Not enough copies available to borrow."
            });
            return;
        }
        // 2. Copies deduction logic
        foundBook.copies -= quantity;
        // 3. Set available=false when copies=0
        if (foundBook.copies === 0) {
            foundBook.available = false;
        }
        await foundBook.save();
        const data = await borrow_model_1.Borrow.create({ book, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Verification failed",
            error: error,
        });
    }
});
// borrow books summary
exports.bookRoutes.get("/api/borrow/", async (req, res) => {
    try {
        const summary = await borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: "$bookDetails",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve borrowed books summary.",
            error: error,
        });
    }
});
