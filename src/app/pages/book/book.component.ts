import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  paramSub!: Subscription;
  bookSub!: Subscription;
  book!: Partial<IBook>;

  constructor(private svc: BookapiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.wait();
    this.paramSub = this.route.params.subscribe((param: any) => {
      this.paramSub = this.svc.getSingleBook(param.id).subscribe((res) => {
        this.book = res;
        console.log(res);
        this.isLoading = false;
      });
    });
  }

  wait() {
    setTimeout(() => {
      this.isWaiting = false;
    }, 1500);
  }
}
