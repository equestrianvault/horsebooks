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
		let newBooks:Array<Book> = new Array(0);

		let searchBooks = books;

		for(let searchTerm of lowerSearchString.split(" ")){
			searchBooks = searchBooks.filter(
				// search titles
					book => book.title.toLowerCase().includes(searchTerm)
				)
				.concat(
					// search authors
					searchBooks.filter(
						book => book.authors.filter(author => author.name.toLowerCase().includes(searchTerm)).length > 0
					)
				)
				.concat(
					// search tags
					searchBooks.filter(
						book => book.tags.filter(tag => tag.toLowerCase().match(searchTerm)).length > 0
					)
				);
		}
			

		return Array.from(new Set(Array.from(searchBooks)))
			// Sort by Id
			.sort( (booka, bookb) => {
				if(booka.id > bookb.id){
					return 1;
				}else if (booka.id < bookb.id){
					return -1;
				}else{
					return 0
				}
			});
	}
}