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
  formData: IFormData = {
    query: '',
    isItalian: false,
    isEnglish: false,
    isAllLang: true,
  };
  btnText: string = 'All lang';

  @Output() onSubmit = new EventEmitter();

  formSubmit(): void {
    const outObj: IFormData = {
      query: this.formData.query,
      isItalian: this.formData.isItalian ? true : false,
      isEnglish: this.formData.isEnglish ? true : false,
      isAllLang: this.formData.isAllLang ? true : false,
    };
    this.onSubmit.emit(outObj);
    this.formData.query = '';
  }

  setSearchFilter(type: number): void {
    if (type == 1) {
      this.btnText = 'All lang';
      this.formData.isAllLang = true;
      this.formData.isEnglish = false;
      this.formData.isItalian = false;
    } else if (type == 2) {
      this.btnText = 'ENG Only';
      this.formData.isAllLang = false;
      this.formData.isEnglish = true;
      this.formData.isItalian = false;
    } else {
      this.btnText = 'ITA Only';
      this.formData.isAllLang = false;
      this.formData.isEnglish = false;
      this.formData.isItalian = true;
    }
  }
}
