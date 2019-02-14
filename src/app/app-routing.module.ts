import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppBody } from './components/app-body/app-body.component';
import { BookDetail } from './components/book-detail/book-detail.component';

const routes: Routes = [
	{ path: '', component: AppBody },
	{ path: 'book/:id', component: BookDetail }
];

@NgModule({
	exports: [ RouterModule ],
	imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
