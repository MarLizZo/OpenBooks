import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  btnSearchParam: string = 'Everything';
  searchQuery: string = '';

  @Output() onSubmit = new EventEmitter();

  formSubmit(): void {
    console.log(this.searchQuery);
    this.onSubmit.emit({
      query: this.searchQuery,
      param: this.btnSearchParam,
    });
    this.searchQuery = '';
    console.log(this.searchQuery);
  }

  setSearchFilter(type: number) {
    this.btnSearchParam =
      type == 1 ? 'Everything' : type == 2 ? 'Book Title' : 'Author Name';
  }
}
