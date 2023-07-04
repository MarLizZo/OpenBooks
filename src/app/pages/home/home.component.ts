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
  bookArr: Partial<IBook>[] = []; // array of books, initial state empty of course
  bookSub!: Subscription; // subscription of the http observable, will be initialized when we'll call the Service
  private previousRequest!: IFormData; // previous request data stored in a variable to be used from the #loadMore button
  private totalItems!: number; // total items found by the API with our search query. We'll use this as a check for the #loadMore button
  private indexCounter: number = 0; // We'll use this variable on the requests sent by the #loadMore button. The request to the API will have an additional parameter (startsFrom) in order to not get the same books
  isLoading: boolean = false; // variable to display the loading animation
  isWaiting: boolean = false; // additional variable to display the loading animation
  isLoadingMore: boolean = false; // variable to display the loading animation on the #loadMore button
  isLoadingMoreError: boolean = false; // variable to display and error message when the failed request was sent by the #loadMore button
  isFirstReqDone: boolean = false; // variable to check if the initial request sent from the form is succesfully executed
  isError: boolean = false; // variable to display an error message, in HTML it will call the error component
  isSearchError: boolean = false; // variable to display an error message, in HTML it will call the error component
  isLimitReached: boolean = false; // variable that will be used as a check to display a message saying that the user can't load more content when there are no more books available

  @ViewChild('loadMore') btnLoadMore!: ElementRef; // like a document.getElementById

  constructor(private svc: BookapiService, private router: Router) {}

  ngOnInit() {
    this.getLocalData();
    //we check if there are data on the localStorage. Useful in case we are coming back to the homepage from the book info page. This way we preserve the previous results
  }

  ngOnDestroy() {
    if (this.bookSub) this.bookSub.unsubscribe();
    // if the subscription is initialized, we call the unsubscribe method to stop eventually ongoing requests.
  }

  wait() {
    this.isWaiting = true;
    setTimeout(() => {
      this.isWaiting = false;
    }, 2000);
    // simple Timeout function, that will show the loading animation at least for 2 seconds.
  }

  getLocalData(): void {
    let data: IStorageData | null = null;
    if (localStorage.getItem('booksData')) {
      data = JSON.parse(localStorage.getItem('booksData')!);
      // if data are found into the localStorage, then we're parsing them into an object and assigning them inside a variable
    }
    if (data) {
      this.wait(); // animation 2 seconds
      this.isFirstReqDone = true;
      this.bookArr = data.booksArray;
      this.totalItems = data.itemsCount;
      this.previousRequest = data.prevRequest;
      this.indexCounter = data.loadsCounter;
      // So here we are loading the previous data. The books array is populated and the *ngFor will do its magic.
      // We are also setting previousRequest for the #loadMore button, totalItems etc.
    }
  }

  saveLocalData(data: IStorageData) {
    localStorage.setItem('booksData', JSON.stringify(data));
    // stringify an object in order to save the data into the localStorage
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
      // firstReq is true when we send the request using the form. We set the new search query into the previousRequest variable, and we also reset all the other variables to their original state. In the end, the loading animation starts.
    }
    let completeQuery = data.query; // this variable contains now the text input from the form

    if (completeQuery == '') {
      completeQuery = 'The expanse';
      // Just a 'fallback'. Read these books!! The expanse is so good :)
    }

    if (!firstReq) {
      if (!this.isLoadingMoreError) {
        this.indexCounter++;
        // So if we are sending the request from the #loadMore button, increase the indexCounter. As said before, this is needed to load new content by using an additional parameter. Otherwise every call will return the same books (there is a maxResult parameter for call, by default 10. I am using 40, the max value allowed)
      }
      this.isLoadingMoreError = false;
      let startIndex = 40 * this.indexCounter + 1;
      if (startIndex >= this.totalItems) {
        this.isLimitReached = true;
        return;
        // in case there are no more contents to load, the function will stop executing because of the return statement. To check if there are actually new books to load we check of startIndex is greater now than the totalItems (a response number from the API indicating the amount of books found within the query)
      }
      completeQuery += `&startIndex=${startIndex}`;
      // in the end, if we are calling the request from the #loadMore button, append the new parameter to the request.
      // Example: we search for 'Lord of the rings' using the form. We get our 40 results.
      // Now loading more content without extra parameters we will get the same 40 books.
      // With the additional startIndex parameter we are specifying that we want new books starting from the 41th.
      // This trick also works for the third request. The new startIndex will be 81.
    }

    this.bookSub = this.svc
      .getBooks(completeQuery)
      .pipe(
        tap((res) => {
          this.totalItems = res.totalItems; // we check immediatly how much book the API have found
          if (this.totalItems) {
            // if totalItems is a positive number. It will always be but i like to have the 100% security
            res.items.forEach((book) => {
              if (data.isEnglish) {
                // ENG Only is an option inside the input form.
                if (book.volumeInfo.language == 'en') {
                  this.bookArr.push(book);
                  // So if the user wants only English books, then this block is executed.
                  // The book is pushed into the array if the property language is 'en' (English language)
                }
              } else if (data.isItalian) {
                // ITA Only is an option inside the form
                if (book.volumeInfo.language == 'it') {
                  this.bookArr.push(book);
                  // Pushes the book into the array if language is 'it' (Italian)
                }
              } else {
                this.bookArr.push(book);
                // This block is executed when the selected language is not specified (All languages)
              }
            });
            this.isFirstReqDone = true;
            let objToSave: IStorageData = {
              booksArray: this.bookArr,
              prevRequest: this.previousRequest,
              loadsCounter: this.indexCounter,
              itemsCount: this.totalItems,
            };
            this.saveLocalData(objToSave); // save data to localStorage to allow us to recover them in case
          } else {
            this.isSearchError = true;
            // if totalItems is 0, then show the appropriate error message - see HTML
          }
          this.isLoading = false; // response received, switching to false to toggle the loading animation
          if (!firstReq) this.isLoadingMore = false; // same as before, but for the #loadMore button
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
          // if an error occur during the request, then switch to true the error variables, and in any case stop the loading animation
        })
      )
      .subscribe(); // send the request. If no subscribe() method is called, then nothing happen :)
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
    // navigate to the book info page. A parameter is passed inside the URL. We are passing the book ID, this way we can fetch the book info when the component is initialized by getting the ID from the URL and then proceed to the http request.
  }

  clearResults() {
    this.bookArr = [];
    this.isFirstReqDone = false;
    this.indexCounter = 0;
    this.isLimitReached = false;
    this.totalItems = 0;
    // reset the home page
  }
}
