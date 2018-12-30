import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchPipe } from './search.pipe';
import { ShowExpiredPipe } from './expired.pipe';
import { AppComponent } from './app.component';
import { Heading } from './components/heading/heading.component';
import { Footer } from './components/footer/footer.component';
import { AppBody } from './components/app-body/app-body.component';
import { HorseBooksListing } from './components/horse-books-listing/horse-books-listing.component';
import { HorseBookListItem } from './components/horse-books-listing/horse-book-list-item/horse-book-list-item.component';

@NgModule({
  declarations: [
    AppComponent, 
    Heading,
    Footer,
    AppBody,
    HorseBooksListing,
    HorseBookListItem,
    SearchPipe,
    ShowExpiredPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    SearchPipe,
    ShowExpiredPipe
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
