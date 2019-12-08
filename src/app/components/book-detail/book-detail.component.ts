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
       this.id = + params['id']; // (+) converts string 'id' to a number

       this.bookService.getBooks().subscribe((data: Books[]) =>{
         this.book = data.find(book => book.id == this.id);
       });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
