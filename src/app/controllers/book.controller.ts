import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
export const bookRoutes = express.Router();

// create a book

bookRoutes.post("/books/create-book", async (req: Request, res: Response) => {
  const body = req.body;
  const book = await Book.create(body);

  res.status(201).json({
    success: true,
    message: "Books created successfully",
    book,
  });
});

// get all books

bookRoutes.get("/books/", async (req: Request, res: Response) => {
  const bookFilter =
    typeof req.query.filter === "string" 
      ? req.query.filter.toUpperCase()
      : undefined;

  const query: any = {};
  if (bookFilter) {
    query.genre = bookFilter;
  }

  const { genre, sortBy, sort, limit } = req.query; 

  const findQuery: any = {};
  const sortOptions: { [key: string]: 1 | -1 } = {};
  let limitValue: number = 10; 

  // 1. Genre Filter
  if (typeof genre === "string") {
    findQuery.genre = genre.toUpperCase();
  }

  // 2. Sorting
  const actualSortBy = typeof sortBy === 'string' ? sortBy : 'createdAt'; 
  sortOptions[actualSortBy] = (sort === 'desc' || sort === 'descending') ? -1 : 1; 

  // 3. Limiting results
  if (typeof limit === 'string') {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limitValue = parsedLimit;
    }
  }

  const books = await Book.find(query).find(findQuery)
                          .sort(sortOptions)
                          .limit(limitValue);



  res.status(201).json({
    success: true,
    message: "all books get successfully",
    books,
  });
});

// bookRoutes.get('/',async (req: Request, res: Response) => {
//     const { filter, sortBy, sort, limit } = req.query;

//     const findQuery: any = {};
//     const sortOptions: { [key: string]: 1 | -1 } = {};
//     let limitValue: number = 10;

//     if (filter && typeof filter === 'string') {
//         findQuery.genre = filter.toUpperCase();
//     }

//     const actualSortBy = typeof sortBy === 'string' ? sortBy : 'createdAt';
//     sortOptions[actualSortBy] = (sort === 'desc' || sort === 'descending') ? -1 : 1;

//     if (limit && typeof limit === 'string') {
//         const parsedLimit = parseInt(limit, 10);
//         if (!isNaN(parsedLimit) && parsedLimit > 0) {
//             limitValue = parsedLimit;
//         }
//     }

//     const books = await Book.find(findQuery)
//                             .sort(sortOptions)
//                             .limit(limitValue);

//     res.status(201).json({
//         success : true,
//         message : "all users get successfully",
//         count: books.length,
//         books
//     });
// })

// get a single book

bookRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const book = await Book.findOne({ _id: bookId });

  res.status(201).json({
    success: true,
    message: "Book retrieved successfully",
    book,
  });
});

// update a single book

bookRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  const updatedBody = req.body;
  const bookId = req.params.userId;
  const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBody, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    message: "Book updated successfully",
    updatedBook,
  });
});

// delete a book

bookRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.userId;
  const deleteBook = await Book.findByIdAndDelete(bookId);

  res.status(201).json({
    success: true,
    message: "Book deleted successfully",
    data: deleteBook,
  });
});


// borrow books 

bookRoutes.post('/borrow/', async (req: Request, res: Response) => {

        if (!req.body) {
      console.log('ERROR: req.body is undefined or null'); // Log if this branch is taken
      return res.status(400).json({
        success: false,
        message: "Request body is empty or invalid. Please ensure Content-Type: application/json and a valid JSON body."
      });
    }


  try {
    
    const { book: bookId, quantity, dueDate } = req.body;


    console.log(bookId)

    if (!bookId || !quantity || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: 'book' (ID), 'quantity', and 'dueDate' are all necessary."
      });
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number."
      });
    }
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "Invalid dueDate format. Please provide a valid date string (e.g., ISO 8601)."
        });
    }

    const book = await Book.findById(bookId);


    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found."
      });
    }
    console.log(book.copies)

    let currentCopies = parseInt(book.copies as any)
    if (currentCopies < quantity) {
      return res.status(409).json({
        success: false,
        message: "Not enough copies available for this book to fulfill the request."
      });
    }

    currentCopies -= quantity;
    book.available = currentCopies > 0;

    await book.save();

    const borrowRecord = await Borrow.create({
      book: book._id,
      quantity,
      dueDate: parsedDueDate,
    });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord,
    });

  } catch (error: any) {
    let statusCode = 500;
    let errorMessage = "An unexpected error occurred while processing the borrowing request.";

    if (error.name === 'CastError' && error.path === '_id') {
        statusCode = 400;
        errorMessage = "Invalid book ID format provided. Please ensure it's a valid ObjectId.";
    } else if (error.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = `Validation Error: ${error.message}`;
    }

    console.error("Borrowing Error:", error);

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  } 
});

// borrow books summary 

bookRoutes.get('/borrow/', async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails"
        }
      },
      {
        $unwind: "$bookDetails"
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn"
          },
          totalQuantity: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrowed books summary.",
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});
