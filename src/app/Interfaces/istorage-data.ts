import { IBook } from './ibook';
import { IFormData } from './iform-data';

export interface IStorageData {
  booksArray: Partial<IBook>[];
  prevRequest: IFormData;
  loadsCounter: number;
  itemsCount: number;
}
