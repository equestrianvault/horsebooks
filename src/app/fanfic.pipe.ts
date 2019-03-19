import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './services/books.service';

@Pipe({
	name: 'fanficOnly',
	pure: false
})
export class FanficOnlyPipe implements PipeTransform{
	transform(books : Book[], fanficOnly : Boolean) : Book[]{
		if(fanficOnly === true){
			let result = books.filter(book => false === (book.tags.includes("art") || book.tags.includes("comic") || book.tags.includes("artbook") || book.tags.includes("calendar") || book.tags.includes("coloring book")));
			return result;
		}
		return books;
	}
}