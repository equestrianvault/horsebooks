import { Injectable } from '@angular/core';
import { BOOKS } from '../../app/books';

@Injectable()
export class HorseBooksService {
	getBooks() : Book[]{
		return BOOKS;
	}
}

export class Book{
	title : String;
	img : String = "";
	authors : Author[] = null;
	links : BookLink[] = null;
	tags : String[] = null;
	rating : String = null;
}

export class BookLink{
	title : String;
	url : String = null;
}

export class Author{
	name : String;
	url : String = null;
}