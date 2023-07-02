import { Component, ElementRef, ViewChild } from '@angular/core';
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
  private previousRequest: any;
  totalItems!: number;
  indexCounter: number = 0;
  isLoading: boolean = false;
  isWaiting: boolean = false;
  isLoadingMore: boolean = false;
  isFirstReqDone: boolean = false;
  isError: boolean = false;
  isSearchError: boolean = false;
  isLimitReached: boolean = false;

  @ViewChild('loadMore') btnLoadMore!: ElementRef;

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

  doSearch(data: IFormData, firstReq: boolean) {
    if (firstReq) {
      this.bookArr = [];
      this.previousRequest = data;
      this.isLimitReached = false;
      this.totalItems = 0;
      this.isError = false;
      this.isSearchError = false;
      this.indexCounter = 0;
      this.isFirstReqDone = false;
      this.isLoading = true;
      this.wait();
    }
    let completeQuery = data.query;

    if (completeQuery == '') {
      completeQuery = 'The expanse';
    }

    if (!firstReq) {
      this.indexCounter++;
      let startIndex = 40 * this.indexCounter + 1;
      if (startIndex >= this.totalItems) {
        this.isLimitReached = true;
        return;
      }
      completeQuery += `&startIndex=${startIndex}`;
    }

    this.bookSub = this.svc
      .getBooks(completeQuery)
      .pipe(
        tap((res) => {
          this.totalItems = res.totalItems;
          if (this.totalItems) {
            res.items.forEach((book) => {
              if (data.isEnglish) {
                if (book.volumeInfo.language == 'en') this.bookArr.push(book);
              } else if (data.isItalian) {
                if (book.volumeInfo.language == 'it') this.bookArr.push(book);
              } else {
                this.bookArr.push(book);
              }
            });
            this.isFirstReqDone = true;
          } else {
            this.isSearchError = true;
          }
          this.isLoading = false;
          if (!firstReq) this.isLoadingMore = false;
        }),
        catchError((error) => {
          this.isError = true;
          this.isLoading = false;
          this.isWaiting = false;
          this.isSearchError = false;
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

  toBottom() {
    window.scrollTo(0, document.querySelector('body')?.scrollHeight!);
  }

  resetErr() {
    this.isError = false;
    this.isSearchError = false;
  }

  loadMoreContent() {
    this.isLoadingMore = true;
    this.doSearch(this.previousRequest, false);
  }
}
