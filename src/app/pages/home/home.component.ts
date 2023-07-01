import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IBook } from 'src/app/Interfaces/ibook';
import { IFormData } from 'src/app/Interfaces/iform-data';
import { BookapiService } from 'src/app/Service/bookapi.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  bookArr: Partial<IBook>[] = [];
  bookSub!: Subscription;

  constructor(private svc: BookapiService, private router: Router) {}

  ngOnDestroy() {
    if (this.bookSub) this.bookSub.unsubscribe();
  }

  doSearch(data: IFormData) {
    this.bookArr = [];

    if (data.query == '') {
      data.query = 'The expanse';
    }

    this.bookSub = this.svc.getBooks(data.query).subscribe((res) => {
      res.items.forEach((book) => {
        if (data.isEnglish) {
          if (book.volumeInfo.language == 'en') this.bookArr.push(book);
        } else if (data.isItalian) {
          if (book.volumeInfo.language == 'it') this.bookArr.push(book);
        } else {
          this.bookArr.push(book);
        }
      });
      console.log(res);
    });
  }

  goToDetails(book: Partial<IBook>) {
    this.router.navigate(['/book']);
    console.log(book);
  }
}
