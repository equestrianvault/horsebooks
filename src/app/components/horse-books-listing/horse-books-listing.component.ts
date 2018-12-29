import { Component } from '@angular/core';
import { HorseBooksService, Book } from '../../services/books.service';

@Component({
  selector: 'horse-books-listing',
  templateUrl: './horse-books-listing.component.html',
  styleUrls: ['./horse-books-listing.component.css'],
  providers: [HorseBooksService]
})
export class HorseBooksListing{
	books: Book[] = null;
	constructor(private bookService: HorseBooksService){
		this.books = bookService.getBooks();
	}
}
