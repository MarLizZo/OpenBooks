import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBook } from 'src/app/Interfaces/ibook';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() book!: Partial<IBook>;

  @Output() onClick = new EventEmitter();
  // send a signal to the home component.

  btnClick(): void {
    this.onClick.emit(this.book);
    // function to trigger the EventEmitter. We are passing the book as parameter, so the home component knows what to do. When we click on the button, the function called in the home component will redirect the user to the book component, passing the books ID as parameter. Then the book component gets the ID and send a request to the API to recover all the informations like Title, description and so on.
  }
}
