import { IPrices } from './iprices';

export interface ISaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice: Partial<IPrices>;
  retailPrice: Partial<IPrices>;
  buyLink: string;
  offers: [
    {
      finskyOfferType: number;
      listPrice: Partial<IPrices>;
      retailPrice: Partial<IPrices>;
    }
  ];
}
