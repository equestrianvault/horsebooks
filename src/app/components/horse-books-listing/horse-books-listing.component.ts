import { Component, OnInit } from '@angular/core';
import { HorseBooksService, Book } from '../../services/books.service';
import { SearchPipe } from '../../search.pipe';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'horse-books-listing',
  templateUrl: './horse-books-listing.component.html',
  styleUrls: ['./horse-books-listing.component.scss'],
  providers: [HorseBooksService]
})
export class HorseBooksListing implements OnInit{
	books : Book[] = null;
	searchVal : string = "";
	searchValPlaceholder : string = "Search";
	showMature : Boolean = false;
	fanficOnly : Boolean = true;
	showExpired : Boolean = false;
	
	ngOnInit() {
		this.bookService.getBooks().subscribe((data: Book[]) => this.books = data);

		this.route.queryParams.subscribe(params => {
		    if(Object.prototype.hasOwnProperty.call(params, "showExpired")){
				this.showExpired = !!params.showExpired;
			}
		});
	}

	
	constructor(private bookService: HorseBooksService, private route: ActivatedRoute){
		
	}
}
