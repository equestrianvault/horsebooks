import { Injectable } from '@angular/core';
import { BOOKS } from '../../app/books';

@Injectable()
export class HorseBooksService {
	getBooks() : Book[]{
		return BOOKS;
	}
}

export class Book{
	id : number;
	title : string;
	edition : string;
	img : string = "";
	dateAdded : string = null;
	authors : Author[] = null;
	links : BookLink[] = null;
	tags : string[] = null;
	rating : string = null;
	expiry : string = null;
}

export class BookLink{
	title : string;
	url : string = null;
}

export class Author{
	name : string;
	url : string = null;
}
