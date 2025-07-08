export interface IBook {
  title: string,
  author: string,
  genre: string,
  isbn: string,
  description: string,
  copies: number,
  available: boolean,
}
export interface IBookMethods {
  borrowBook: (quantity: number) => Promise<void>;
}