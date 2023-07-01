import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IFormData } from 'src/app/Interfaces/iform-data';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  data: IFormData = {
    query: '',
    param: 'Everything',
    isItalian: false,
    isEnglish: false,
    isAllLang: true,
  };

  @Output() onSubmit = new EventEmitter();

  formSubmit(): void {
    this.onSubmit.emit(this.data);
    this.data.query = '';
  }

  setSearchFilter(type: number) {
    this.data.param =
      type == 1 ? 'Everything' : type == 2 ? 'Book Title' : 'Author Name';
  }
}
