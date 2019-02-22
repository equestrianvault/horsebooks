import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HorseBooksService, Book } from '../../services/books.service';

@Component({
  selector: 'book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
  providers: [HorseBooksService]
})
export class BookDetail {
  id: number;
  private sub: any;
  book: Book = new Book();
  bookService: HorseBooksService;

  constructor(private route: ActivatedRoute, private horsebookservice: HorseBooksService) {
  	this.bookService = horsebookservice;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = +params['id']; // (+) converts string 'id' to a number
       this.book = this.bookService.getBooks().find(book => book.id == this.id);
       // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
