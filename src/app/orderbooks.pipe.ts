import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './services/books.service';

@Pipe({
	name: 'orderBooks',
	pure: false
})
export class OrderBooksPipe implements PipeTransform{
	transform(books: Book[]){
		return books.sort((a, b) => {
			if(a.title > b.title){
				return 1;
			}
			if(a.title < b.title){
				return -1;
			}
			return 0;
		});
	}
}