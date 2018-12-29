import { Component, Input } from '@angular/core';
import { Book } from '../../../services/books.service';

@Component({
  selector: 'horse-book-list-item',
  templateUrl: './horse-book-list-item.component.html',
  styleUrls: ['./horse-book-list-item.component.css']

})
export class HorseBookListItem {
	@Input() book: Book;
}
