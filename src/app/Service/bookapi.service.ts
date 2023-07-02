import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../Interfaces/iresponse';
import { IBook } from '../Interfaces/ibook';

@Injectable({
  providedIn: 'root',
})
export class BookapiService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
  private apiUrlSingle = 'https://www.googleapis.com/books/v1/volumes/';
  constructor(private http: HttpClient) {}

  getBooks(q: string): Observable<IResponse> {
    return this.http.get<IResponse>(this.apiUrl + q + '&maxResults=40');
  }

  getSingleBook(id: string): Observable<Partial<IBook>> {
    return this.http.get<Partial<IBook>>(this.apiUrlSingle + id);
  }
}
