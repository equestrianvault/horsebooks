import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError, merge } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class HorseBooksService {

  private branch: string;
  private books;
  
	constructor(private http: HttpClient) { 
    this.branch = "feature-anthologies";
  }

	getBooks() {
    this.books = merge(
      this.http.get<Book[]>("https://raw.githubusercontent.com/equestrianvault/horsebooks-data/" + this.branch + "/data/books.json"),
      this.http.get<Book[]>("https://raw.githubusercontent.com/equestrianvault/horsebooks-data/" + this.branch + "/data/anthologies.json")
    );
    return this.books;
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
