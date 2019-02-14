import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchPipe } from './search.pipe';
import { ShowMaturePipe } from './mature.pipe';
import { ShowExpiredPipe } from './expired.pipe';
import { OrderBooksPipe } from './orderbooks.pipe';
import { AppComponent } from './app.component';
import { Heading } from './components/heading/heading.component';
import { Footing } from './components/footing/footing.component';
import { AppBody } from './components/app-body/app-body.component';
import { BookDetail } from './components/book-detail/book-detail.component';
import { HorseBooksListing } from './components/horse-books-listing/horse-books-listing.component';
import { HorseBookListItem } from './components/horse-books-listing/horse-book-list-item/horse-book-list-item.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent, 
    Heading,
    Footing,
    AppBody,
    BookDetail,
    HorseBooksListing,
    HorseBookListItem,
    SearchPipe,
    ShowExpiredPipe,
    ShowMaturePipe,
    OrderBooksPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  exports: [
    SearchPipe,
    ShowExpiredPipe,
    ShowMaturePipe,
    OrderBooksPipe
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
