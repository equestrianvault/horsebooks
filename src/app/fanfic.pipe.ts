import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './services/books.service';

@Pipe({
	name: 'fanficOnly',
	pure: false
})
export class ShowFanficOnly implements PipeTransform{
	transform(books : Book[], fanficOnly : Boolean) : Book[]{
		let now = Date.now();
		if(fanficOnly === true){
			let result = books.filter(book.tags.includes("fimfic"));
			return result;
		}
		return books;
	}
}