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
  @Input() genericError!: boolean;
  @Input() searchError!: boolean;

  @Output() onDismiss = new EventEmitter();

  dismiss(): void {
    this.onDismiss.emit();
  }
}
