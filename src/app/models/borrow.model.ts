import { Schema } from "mongoose";
import { model } from "mongoose";
import { IBorrow } from "../interface/borrowBook.interface";

const bookBorrowSchema = new Schema<IBorrow>({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, 
  quantity: { type: Number, required: true, min: 1 },
  dueDate: { type: Date, required: true }
},
{
  versionKey: false, 
  timestamps: true, 
});

export const Borrow = model("Borrow", bookBorrowSchema);
