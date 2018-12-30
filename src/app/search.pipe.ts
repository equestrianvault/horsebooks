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
		let newBooks = 
			books.filter(
				// search titles
					book => book.title.toLowerCase().includes(lowerSearchString)
			)
			.concat(
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
			)
			.concat(
				// search cover types
				books.filter(
					book => book.cover.toLowerCase().includes(lowerSearchString)
				)
			)
			;

		return Array.from(new Set(Array.from(newBooks)))
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