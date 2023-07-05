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
  // Think of this like a signal. The home component will receive this signal and then proceed to send the request

  formSubmit(): void {
    const outObj: IFormData = {
      query: this.formData.query,
      isItalian: this.formData.isItalian ? true : false,
      isEnglish: this.formData.isEnglish ? true : false,
      isAllLang: this.formData.isAllLang ? true : false,
    };
    // We are creating a new object because of the two-way binding. If we pass directly the formData object, then every changes to the form will be reflected inside the home component too. We don't want this to happen.
    this.onSubmit.emit(outObj);
    // emit is the method that actually send the signal to the linked component
    this.formData.query = '';
    // resets the input field
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
    // not that elegant.. switches the language parameter that we will use to show the user the desired books
  }
}
