import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, tap } from 'rxjs';
import { IBook } from 'src/app/Interfaces/ibook';
import { BookapiService } from 'src/app/Service/bookapi.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent {
  isLoading: boolean = true;
  isWaiting: boolean = true;
  isError: boolean = false;
  isErrorCheck: boolean = false;
  paramSub!: Subscription;
  bookSub!: Subscription;
  book!: Partial<IBook>;

  constructor(private svc: BookapiService, private route: ActivatedRoute) {}
  // Injection of the Service and ActivatedRoute to get the parameters from URL

  ngOnInit() {
    this.getBookData();
  }

  ngOnDestroy() {
    if (this.paramSub) this.paramSub.unsubscribe();
    if (this.bookSub) this.bookSub.unsubscribe();
  }

  getBookData(): void {
    this.isWaiting = true;
    this.isLoading = true;
    this.isError = false;
    this.isErrorCheck = false;
    // reset eventual previous errors and toggle on the animation checks for HTML
    this.wait(); // start the timeout function

    this.paramSub = this.route.params.subscribe((param: any) => {
      // Yes, the function to get the parameters from the URL is an observable. So we need to use the subscribe method.
      this.bookSub = this.svc
        .getSingleBook(param.id) // call the service function passing the books ID
        .pipe(
          tap((res) => {
            this.book = res; // store the result into the book variable, ready to be used inside the HTML
            if (!isNaN(Date.parse(this.book.volumeInfo!.publishedDate))) {
              this.book.volumeInfo!.publishedDate = new Date(
                this.book.volumeInfo!.publishedDate
              ).toLocaleDateString();
              // This function will convert the property publishedDate into a better format. This property sometimes comes in a horrible looking format for the user, so we convert it with the toLocalDateString() method. But before we check if the property is in a convertible format with the isNaN check. We are passing to the isNaN the publishedDate as a Date. Date.parse returns the milliseconds passed from 1 Jan 1970 from the Date passed as argument. If the parsing operation is ok, then the result will be a number (milliseconds). When this check is passed we finally convert the milliseconds to a more readable format.
            }
            this.isError = false;
            this.isErrorCheck = false;
            this.isLoading = false;
          }),
          catchError((error) => {
            this.isLoading = false;
            this.isWaiting = false;
            this.isError = true;
            this.isErrorCheck = true;
            throw Error;
          })
        )
        .subscribe(); // always needed with an abservable
    });
  }

  wait() {
    setTimeout(() => {
      this.isWaiting = false;
    }, 1500);
  }

  dismiss() {
    this.isError = false;
  }
}
