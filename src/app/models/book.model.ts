import { Schema } from "mongoose";
import { model } from "mongoose";
import { IBook } from "../interface/book.interface";

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true, trim: true },
  author: { type : String, required: true , trim: true},
  genre: {type : String, required: true , trim: true, uppercase: true},
  isbn: {type: String , required: true},
  description: {type : String, required: true , trim: true},
  copies: { type: Number , min: 0},
  available: {type: Boolean,required: true }
},
{
    versionKey : false,
    timestamps :true,
});

export const Book = model("Book", bookSchema);
