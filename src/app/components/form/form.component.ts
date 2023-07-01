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
    isItalian: false,
    isEnglish: false,
    isAllLang: true,
  };
  btnText: string = 'All lang';

  @Output() onSubmit = new EventEmitter();

  formSubmit(): void {
    this.onSubmit.emit(this.data);
    this.data.query = '';
  }

  setSearchFilter(type: number): void {
    if (type == 1) {
      this.btnText = 'All lang';
      this.data.isAllLang = true;
      this.data.isEnglish = false;
      this.data.isItalian = false;
    } else if (type == 2) {
      this.btnText = 'ENG Only';
      this.data.isAllLang = false;
      this.data.isEnglish = true;
      this.data.isItalian = false;
    } else {
      this.btnText = 'ITA Only';
      this.data.isAllLang = false;
      this.data.isEnglish = false;
      this.data.isItalian = true;
    }
  }
}
