import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Heading } from './components/heading/heading.component'
import { AppBody } from './components/app-body/app-body.component'
import { HorseBooksListing } from './components/horse-books-listing/horse-books-listing.component'
import { HorseBookListItem } from './components/horse-books-listing/horse-book-list-item/horse-book-list-item.component'

@NgModule({
  declarations: [
    AppComponent, 
    Heading,
    AppBody,
    HorseBooksListing,
    HorseBookListItem
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
