import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './services/books.service';

@Pipe({
	name: 'fanficOnly',
	pure: false
})
export class FanficOnlyPipe implements PipeTransform{
	transform(books : Book[], fanficOnly : Boolean) : Book[]{
		console.log(fanficOnly)
		if(fanficOnly === true){
			console.log("OwO hewwo worwd")
			let result = books.filter(book => book.tags.includes("fimfic"));
			return result;
		}
		return books;
	}
}