import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  ngOnDestroy() {
    if (localStorage.getItem('booksData')) {
      localStorage.removeItem('booksData');
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    if (localStorage.getItem('booksData')) {
      localStorage.removeItem('booksData');
    }
  }
}
