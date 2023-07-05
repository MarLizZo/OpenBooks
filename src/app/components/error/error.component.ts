import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  @Input() genericError!: boolean; // input variable, indicate to show the generic error element
  @Input() searchError!: boolean; // input variable, indicate to show the search error element

  @Output() onDismiss = new EventEmitter();
  // indicates that the user clicked on the X icon to close the alert

  dismiss(): void {
    this.onDismiss.emit();
  }
}
