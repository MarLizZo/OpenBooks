import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';

@NgModule({
  declarations: [BookComponent],
  imports: [CommonModule, BookRoutingModule, LoaderComponent],
})
export class BookModule {}
