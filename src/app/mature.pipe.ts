import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './services/books.service';

@Pipe({
	name: 'showMature',
	pure: false
})
export class ShowMaturePipe implements PipeTransform{
	transform(books : Book[], showMature : Boolean) : Book[]{
		let now = Date.now();
		if(showMature === true){
			return books;
		}
		let result = books.filter(book => book.rating === null || book.rating.toLowerCase() !== "m");
		return result;
	}
}