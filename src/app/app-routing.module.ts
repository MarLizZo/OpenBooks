import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'book/:id', // id is the name of the parameter that we will pass from the home component. It's the Book's ID
    loadChildren: () =>
      import('./pages/book/book.module').then((m) => m.BookModule),
  },
  // loadChildren is the method to load the lazy-loaded modules. This is created automatically by using the 'magic' command to create a module. Example: ng generate module pages/contacts --route contacts --module app.module
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
