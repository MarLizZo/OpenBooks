import { IBook } from './ibook';

export interface IResponse {
  kind: string;
  totalItems: number;
  items: IBook[];
}
