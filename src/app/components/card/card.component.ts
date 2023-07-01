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

  btnClick(): void {
    this.onClick.emit(this.book);
  }
}
