import { Injectable } from '@angular/core';
import { STORIES, AUTHORS, BOOKS, PUBLICATIONS } from '../../app/data';

@Injectable()
export class HorseBooksDataService {
	getStories() : Story[]{
		return STORIES;
	}
	getAuthors() : Author[] {
		return AUTHORS;
	}
	getBooks() : Book[]{
		return BOOKS;
	}
	getPublications() : Publication[]{
		return PUBLICATIONS;
	}
}

export class Story{
	id : number;
	title : string;
	description : string;
	image : string = null;
	authorIds : number[];
	rating : string = null;
	sourceLinks : Link[];
	tags : string[];
}

export class Author{
	id : number;
	name : string;
	url : string = null;
}

export class Book{
	id : number;
	storyIds : number[];
	title : string;
	image : string = null;
	description : string = null;
}

export class Link{
	title : string;
	url : string;
}

export class ExpiringLink extends Link{
	startDate : string;
	expiry : string = null;
}

export class Publication{
	id : number;
	bookId : number;
	edition : string;
	purchaseLinks : ExpiringLink[];
}
