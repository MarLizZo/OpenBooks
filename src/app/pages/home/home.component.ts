import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError, tap } from 'rxjs';
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
  previousRequest!: IFormData;
  totalItems!: number;
  indexCounter: number = 0;
  isLoading: boolean = false;
  isWaiting: boolean = false;
  isError: boolean = false;
  isLimitReached: boolean = false;

  constructor(private svc: BookapiService, private router: Router) {}

  ngOnDestroy() {
    if (this.bookSub) this.bookSub.unsubscribe();
  }

  wait() {
    this.isWaiting = true;
    setTimeout(() => {
      this.isWaiting = false;
    }, 2000);
  }

  doSearch(data: IFormData) {
    if (this.indexCounter == 0) {
      this.bookArr = [];
      this.previousRequest = data;
      this.isLimitReached = false;
      this.totalItems = 0;
    }

    this.isLoading = true;
    this.wait();

    if (data.query == '') {
      data.query = 'The expanse';
    }

    if (this.indexCounter != 0) {
      let startIndex = 40 * this.indexCounter;
      if (startIndex >= this.totalItems) {
        this.isLimitReached = true;
        return;
      }
      data.query += `&startIndex=${startIndex}`;
    }

    this.bookSub = this.svc
      .getBooks(data.query)
      .pipe(
        tap((res) => {
          this.totalItems = res.totalItems;
          res.items.forEach((book) => {
            if (data.isEnglish) {
              if (book.volumeInfo.language == 'en') this.bookArr.push(book);
            } else if (data.isItalian) {
              if (book.volumeInfo.language == 'it') this.bookArr.push(book);
            } else {
              this.bookArr.push(book);
            }
          });
          this.isLoading = false;
        }),
        catchError((error) => {
          this.isError = true;
          this.isLoading = false;
          this.isWaiting = false;
          throw error;
        })
      )
      .subscribe();
  }

  goToDetails(book: Partial<IBook>) {
    this.router.navigate(['/book']);
  }

  toTop() {
    window.scrollTo(0, 0);
  }
}
