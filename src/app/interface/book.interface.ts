export interface IBook {
  title: string,
  author: string,
  genre: string,
  isbn: string,
  description: { type: String, required: true },
  copies: number,
  available: Boolean,
}
export interface IBookMethods {
  borrowBook: (quantity: number) => Promise<void>;
}