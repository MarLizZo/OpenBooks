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
    this.wait();
    this.paramSub = this.route.params.subscribe((param: any) => {
      this.bookSub = this.svc
        .getSingleBook(param.id)
        .pipe(
          tap((res) => {
            this.book = res;
            if (!isNaN(Date.parse(this.book.volumeInfo!.publishedDate))) {
              this.book.volumeInfo!.publishedDate = new Date(
                this.book.volumeInfo!.publishedDate
              ).toLocaleDateString();
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
        .subscribe();
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
