import { Component } from '@angular/core';
import { IBook } from 'src/app/Interfaces/ibook';
import { IFormData } from 'src/app/Interfaces/iform-data';
import { BookapiService } from 'src/app/Service/bookapi.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  bookArr: IBook[] = [];
  constructor(private svc: BookapiService) {}

  doSearch(data: IFormData) {
    this.bookArr = [];
    let completeQuery: string = '';

    if (data.query === '') {
      completeQuery = 'The Expanse';
    }

    if (!data.isAllLang) {
      completeQuery += data.isEnglish
        ? `&langRestrict="en"`
        : `&langRestrict="it"`;
    }

    if (data.param == 'Everything') {
      this.svc.getBooks(completeQuery).subscribe((data) => {
        data.items.forEach((book) => {
          this.bookArr.push(book);
        });
        console.log(data);
      });
    }
  }
}
