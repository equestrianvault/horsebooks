import { Injectable } from '@angular/core';
import { STORIES, AUTHORS, BOOKS, LINKS, PUBLICATIONS, COLLECTIONS, COLLECTION_ENTRIES } from '../../app/data';

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
	getLinks() : Link[]{
		return LINKS;
	}
	getPublications() : Publication[]{
		return PUBLICATIONS;
	}
	getCollections() : Collection[]{
		return COLLECTIONS;
	}
	getCollectionEntries() : CollectionEntry[]{
		return COLLECTION_ENTRIES;
	}

}

export class Story{
	id : number;
	title : string;
	description : string;
	image : string = null;
	authorIds : number[];
	rating : string = null;
	sourceLinkIds = number[];
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
	id : number;
	title : string;
	url : string;
	startDate : string;
	expiry : string = null;
}

export class Publication{
	id : number;
	bookId : number;
	edition : string;
	purchaseLinkIds : number[];
}

export class Collection{
	id : number;
	title : string;
	description : string = null;
	imageUrl : string = null;
	collectionEntryId = number[];
}

export class CollectionEntry{
	id : number;
	bookId : number;
	collectionId : number;
	order : number;
}