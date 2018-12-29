import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './services/books.service';

@Pipe({
	name: 'search',
	pure: false
})
export class SearchPipe implements PipeTransform{
	transform(books : Book[], searchString : string) : Book[]{
		let lowerSearchString = searchString.toLowerCase();
		if(lowerSearchString === ""){
			return books;
		}
		return 
			books.filter(
				// search titles
					book => book.title.toLowerCase().includes(lowerSearchString)
			)
/*			.concat(
				// search authors
				books.filter(
					book => book.authors.filter(author => author.name.toLowerCase().includes(lowerSearchString)).length > 0
				)
			)
			.concat(
				// search tags
				books.filter(
					book => book.tags.filter(tag => tag.toLowerCase().match(lowerSearchString)).length > 0
				)
			)*/
			;
	}
}