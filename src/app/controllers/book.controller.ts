import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
export const bookRoutes = express.Router();



// create a book

bookRoutes.post("/books/create-book", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);

    res.status(201).json({
      success: true,
      message: "Books created successfully",
      book,
    });
  } catch (error ) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error,
    });
  }
});

// get all books

// bookRoutes.get("/books/", async (req: Request, res: Response) => {
//   try {
//     const bookFilter =
//       typeof req.query.filter === "string"
//         ? req.query.filter.toUpperCase()
//         : undefined;

//     const query  = {};
//     // if (bookFilter) {
//     //   console.log(query)
//     //   query.genre = bookFilter;
//     // }

//     const {genre,  sortBy, sort, limit } = req.query;

//     const findQuery  = {};
//     const sortOptions: { [key: string]: 1 | -1 } = {};
//     let limitValue: number = 10;

  
  
//     // const genre = req.query.filter
//     // console.log(genre)
//     // 1. Genre Filter

    
//     if (typeof genre === "string") {
//       findQuery.genre = genre.toUpperCase();
//     }

//     // 2. Sorting
//     const actualSortBy = typeof sortBy === "string" ? sortBy : "createdAt";
//     sortOptions[actualSortBy] =
//       sort === "desc" || sort === "descending" ? -1 : 1;

//     // 3. Limiting results
//     if (typeof limit === "string") {
//       const parsedLimit = parseInt(limit, 10);
//       if (!isNaN(parsedLimit) && parsedLimit > 0) {
//         limitValue = parsedLimit;
//       }
//     }

//     const books = await Book.find(query)
//       .find(findQuery)
//       .sort(sortOptions)
//       .limit(limitValue);

//     res.status(201).json({
//       success: true,
//       message: "all books get successfully",
//       books,
//     });
//   } catch (error ) {
//     res.status(400).json({
//       message: "Validation failed",
//       success: false,
//       error: error,
//     });
//   }
// });

bookRoutes.get("/books", async (req: Request, res: Response): Promise<void> => {
  try {
    const { genre, sortBy, sort, limit } = req.query;

    const findQuery: { [key: string]: any } = {};
    const sortOptions: { [key: string]: 1 | -1 } = {};
    let limitValue = 10;

    // 1. Genre Filter
    if (typeof genre === "string") {
      findQuery.genre = genre.toUpperCase();
    }

    // 2. Sorting
    const actualSortBy = typeof sortBy === "string" ? sortBy : "createdAt";
    sortOptions[actualSortBy] =
      sort === "desc" || sort === "descending" ? -1 : 1;

    // 3. Limiting results
    if (typeof limit === "string") {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limitValue = parsedLimit;
      }
    }

    const books = await Book.find(findQuery)
      .sort(sortOptions)
      .limit(limitValue);

    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error,
    });
  }
});


// get a single book

bookRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findOne({ _id: bookId });

    res.status(201).json({
      success: true,
      message: "Book retrieved successfully",
      book,
    });
  } catch (error ) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error,
    });
  }
});

// update a single book

bookRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const updatedBody = req.body;
    const bookId = req.params.bookId;
    // console.log(bookId)
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBody, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error ) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error,
    });
  }
});

// delete a book

bookRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const deleteBook = await Book.findByIdAndDelete(bookId);

    res.status(201).json({
      success: true,
      message: "Book deleted successfully",
      data: deleteBook,
    });
  } catch (error ) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error,
    });
  }
});

// borrow books

bookRoutes.post("/borrow/", async (req: Request, res: Response): Promise<void> =>{

    try {
    // const { book: bookId, quantity, dueDate } = req.body;


    // if (typeof quantity !== "number" || quantity <= 0) {
    //    res.status(400).json({
    //     success: false,
    //     message: "Quantity must be a positive number.",
    //   });
    // }
    // const parsedDueDate = new Date(dueDate);
    // if (isNaN(parsedDueDate.getTime())) {
    //    res.status(400).json({
    //     success: false,
    //     message:
    //       "Invalid dueDate format. Please provide a valid date string.",
    //   });
    // }

    // const book = await Book.findById(bookId);

    // if (!book) {
    //    res.status(404).json({
    //     success: false,
    //     message: "Book not found.",
    //   });
    // }
    // // console.log(book.copies);

    // let currentCopies = book.copies;
    // if (currentCopies < quantity) {
    //    res.status(409).json({
    //     success: false,
    //     message:
    //       "Not enough copies available for this book to fulfill the request.",
    //   });
    // }

    // currentCopies -= quantity;
    // book.available = currentCopies > 0;

    // await book.save();

    // const borrowRecord = await Borrow.create({
    //   book: book._id,
    //   quantity,
    //   dueDate: parsedDueDate,
    // });

      const { book, quantity, dueDate } = req.body;
      const foundBook = await Book.findById(book);
      if (!foundBook) {
        res.status(404).json({
          success: false,
          message: "Book not found!",
        });
        return;
      }
      // await foundBook.borrowBook(quantity);
      const data = await Borrow.create({ book, quantity, dueDate });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "verification failed",
      error : error
    });
  }

});


// bookRoutes.post("/borrow/", async (req: Request, res: Response): Promise< void> => {
//   try {
//     const { book: bookId, quantity, dueDate } = req.body;

//     if (typeof quantity !== "number" || quantity <= 0) {
//        res.status(400).json({
//         success: false,
//         message: "Quantity must be a positive number.",
//       });
//     }

//     const parsedDueDate = new Date(dueDate);
//     if (isNaN(parsedDueDate.getTime())) {
//        res.status(400).json({
//         success: false,
//         message: "Invalid dueDate format. Please provide a valid date string.",
//       });
//     }

//     const book = await Book.findById(bookId);
//     if (!book) {
//        res.status(404).json({
//         success: false,
//         message: "Book not found.",
//       });
//     }

//     if (book.copies < quantity) {
//        res.status(409).json({
//         success: false,
//         message: "Not enough copies available for this book to fulfill the request.",
//       });
//     }

//     book.copies -= quantity;
//     book.available = book.copies > 0;
//     await book.save();

//     const borrowRecord = await Borrow.create({
//       book: book._id,
//       quantity,
//       dueDate: parsedDueDate,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Book borrowed successfully",
//       data: borrowRecord,
//     });
//   } catch (error) {
//     console.error("Borrow error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Verification failed",
//       error,
//     });
//   }
// });



// borrow books summary

bookRoutes.get("/borrow/", async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
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
  } catch (error ) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrowed books summary.",
      error:  error,
    });
  }
});
