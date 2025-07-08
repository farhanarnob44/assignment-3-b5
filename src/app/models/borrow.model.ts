import { Schema } from "mongoose";
import { model } from "mongoose";
import { IBorrow } from "../interface/borrowBook.interface";
import { IBookMethods } from "../interface/book.interface";

const bookBorrowSchema = new Schema<IBorrow, IBookMethods>({
 book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer.",
      },
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Due date must be in the future!",
      },
    },
  },

{
  versionKey: false, 
  timestamps: true, 
});

export const Borrow = model("Borrow", bookBorrowSchema);
