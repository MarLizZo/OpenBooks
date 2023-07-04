import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError, tap } from 'rxjs';
import { IBook } from 'src/app/Interfaces/ibook';
import { IFormData } from 'src/app/Interfaces/iform-data';
import { IStorageData } from 'src/app/Interfaces/istorage-data';
import { BookapiService } from 'src/app/Service/bookapi.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  bookArr: Partial<IBook>[] = [];
  bookSub!: Subscription;
  private previousRequest!: IFormData;
  totalItems!: number;
  indexCounter: number = 0;
  isLoading: boolean = false;
  isWaiting: boolean = false;
  isLoadingMore: boolean = false;
  isLoadingMoreError: boolean = false;
  isFirstReqDone: boolean = false;
  isError: boolean = false;
  isSearchError: boolean = false;
  isLimitReached: boolean = false;

  @ViewChild('loadMore') btnLoadMore!: ElementRef;

  constructor(private svc: BookapiService, private router: Router) {}

  ngOnInit() {
    this.getLocalData();
  }

  ngOnDestroy() {
    if (this.bookSub) this.bookSub.unsubscribe();
  }

  wait() {
    this.isWaiting = true;
    setTimeout(() => {
      this.isWaiting = false;
    }, 2000);
  }

  getLocalData(): void {
    let data: IStorageData | null = null;
    if (localStorage.getItem('booksData')) {
      data = JSON.parse(localStorage.getItem('booksData')!);
    }
    if (data) {
      this.wait();
      this.isFirstReqDone = true;
      this.bookArr = data.booksArray;
      this.totalItems = data.itemsCount;
      this.previousRequest = data.prevRequest;
      this.indexCounter = data.loadsCounter;
    }
  }

  saveLocalData(data: IStorageData) {
    localStorage.setItem('booksData', JSON.stringify(data));
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
      if (!this.isLoadingMoreError) {
        this.indexCounter++;
      }
      this.isLoadingMoreError = false;
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
                if (book.volumeInfo.language == 'en') {
                  this.bookArr.push(book);
                }
              } else if (data.isItalian) {
                if (book.volumeInfo.language == 'it') {
                  this.bookArr.push(book);
                }
              } else {
                this.bookArr.push(book);
              }
            });
            this.isFirstReqDone = true;
            let objToSave: IStorageData = {
              booksArray: this.bookArr,
              prevRequest: this.previousRequest,
              loadsCounter: this.indexCounter,
              itemsCount: this.totalItems,
            };
            this.saveLocalData(objToSave);
          } else {
            this.isSearchError = true;
          }
          this.isLoading = false;
          if (!firstReq) this.isLoadingMore = false;
        }),
        catchError((error) => {
          if (!firstReq) {
            this.isLoadingMoreError = true;
            this.isLoadingMore = false;
          } else {
            this.isError = true;
          }
          this.isLoading = false;
          this.isWaiting = false;
          this.isSearchError = false;
          throw error;
        })
      )
      .subscribe();
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

  goToDetail(book: Partial<IBook>) {
    this.router.navigate([`/book/${book.id}`]);
  }

  clearResults() {
    this.bookArr = [];
    this.isFirstReqDone = false;
    this.indexCounter = 0;
    this.isLimitReached = false;
    this.totalItems = 0;
  }
}
