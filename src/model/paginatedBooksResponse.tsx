import type { IBook } from "./book";

export interface PaginatedBooksResponse{
    books: Array<IBook>,
    currentPage: Number,
    maxPage: Number,
    pageSize: Number,
    query?: string
    message?: string
}
