import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    if (localStorage.getItem('booksData')) {
      localStorage.removeItem('booksData');
    }
  }
  // remove datas from the localStorage if present. This is done when the user refresh or directly close the page. The ngOnDestroy is not enough this time. We need this method to check when the page is going to be closed or refreshed.
}
