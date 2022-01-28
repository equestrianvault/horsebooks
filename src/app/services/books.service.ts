import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class HorseBooksService {

  private branch: string;
  
	constructor(private http: HttpClient) { 
    this.branch = "blob/feature-anthologies";
  }

	getBooks() {
		return 
    
    this
		.http
		.get("https://raw.githubusercontent.com/equestrianvault/horsebooks-data/" + this.branch + "/data/books.json")
    +
    this
		.http
		.get("https://raw.githubusercontent.com/equestrianvault/horsebooks-data/" + this.branch + "/data/anthologies.json")
    ;
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
