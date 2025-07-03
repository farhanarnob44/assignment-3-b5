import express, { Request, Response } from "express"
import { Book } from "../models/book.model";
export const bookRoutes = express.Router();

bookRoutes.post('/create-book',async (req: Request, res: Response) => {
    const body = req.body
    const book = await Book.create(body)

    res.status(201).json({
        success : true,
        message : "Book created successfully",
        book
    })
})
bookRoutes.get('/',async (req: Request, res: Response) => {

    const users = await Book.find();

    res.status(201).json({
        success : true,
        message : "User created successfully",
        users
    })


})
bookRoutes.get('/:bookId',async (req: Request, res: Response) => {

    const bookId = req.params.bookId
    const book = await Book.findOne( {_id : bookId} );

    res.status(201).json({
        success : true,
        message : "User retrieved successfully",
        book
    })


})
bookRoutes.patch('/:userId',async (req: Request, res: Response) => {

    const updatedBody = req.body
    const userId = req.params.userId
    const user = await Book.findByIdAndUpdate( userId , updatedBody, {new : true});

    res.status(201).json({
        success : true,
        message : "User updated successfully",
        user
    })


})
