import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './services/books.service';

@Pipe({
	name: 'showExpired',
	pure: false
})
export class ShowExpiredPipe implements PipeTransform{
	transform(books : Book[], showExpired : Boolean) : Book[]{
		let now = Date.now();
		if(showExpired === true){
			return books;
		}
		let result = books.filter(book => book.expiry === null || (Date.parse(book.expiry) >= now) );
		return result;
	}
}